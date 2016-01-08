var config = {};

FastTrack = {
  configure: (options) => {
    // allowRead and allowWrite
    config = options;
  },
  log: (info) => {
    let selector = {
      type: info.type,
      id: info.id || null,
    };

    let event = _.pick(info, 'time', 'message', 'link', 'data');

    if (!event.time) event.time = new Date();

    FastTrack.Collection.upsert(selector, {
      $push: {
        events: event
      },
      $setOnInsert: {
        createdAt: new Date()
      }
    });
  },
  get: (info) => {
    let selector = {
      type: info.type,
      id: info.id || null,
    };

    let doc = FastTrack.Collection.findOne(selector);
    return doc && doc.events;
  }
};

// Exported for tests
initialize = function initialize() {
  let collection;
  if (process.env.FAST_TRACK_MONGO_URL) {
    let driverOptions;

    if (process.env.FAST_TRACK_MONGO_OPLOG_URL) {
      driverOptions = {
        oplogUrl: process.env.FAST_TRACK_MONGO_OPLOG_URL,
      };
    }

    collection = new Mongo.Collection('fast_track', {
      _driver: new MongoInternals.RemoteCollectionDriver(process.env.FAST_TRACK_MONGO_URL, driverOptions)
    });
  } else {
    collection = new Mongo.Collection('fast_track');
  }

  // Indexes
  collection._ensureIndex({type: 1, id: 1}, {background: true});

  FastTrack.Collection = collection;
};
initialize();

Meteor.methods({
  '__fast_track_log': function (info) {
    if (typeof config.allowWrite !== 'function') {
      throw new Meteor.Error('not-allowed', 'Define an allowWrite function using FastTrack.configure on the server' +
        ' if you want to allow logging from clients.');
    }

    if (config.allowWrite(this.userId, info) !== true) {
      throw new Meteor.Error('not-allowed', 'You are not allowed to call FastTrack.log from a client.');
    }

    return FastTrack.log(info);
  }
});

Meteor.publish('__fast_track', function (selector, options) {
  if (typeof config.allowRead !== 'function' || config.allowRead(this.userId, selector) !== true) return [];
  return FastTrack.Collection.find(selector, options || {});
});

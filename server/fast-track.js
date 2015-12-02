var collection = new Mongo.Collection('fast_track');
var config = {};

FastTrack = {
  Collection: collection,
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

    collection.upsert(selector, {
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

    let doc = collection.findOne(selector);
    return doc && doc.events;
  }
};

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
  return collection.find(selector, options || {});
});

// Indexes
collection._ensureIndex({type: 1, id: 1});

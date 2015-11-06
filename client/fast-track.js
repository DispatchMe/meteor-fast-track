let collection = new Mongo.Collection('fast_track');

FastTrack = {
  Collection: collection,
  subscribe: (selector, options, callback) => {
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }

    return Meteor.subscribe('__fast_track', selector, options, callback);
  },
  log: (info, callback) => {
    return Meteor.call('__fast_track_log', info, callback);
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

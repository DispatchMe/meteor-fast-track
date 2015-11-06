Template.FastTrackReport.helpers({
  doc: function () {
    let type = this.type || null;
    let id = this.id || null;
    return FastTrack.Collection.findOne({
      type,
      id
    });
  },
  dataJson: function () {
    return JSON.stringify(this.data, null, 2);
  }
});

Template.FastTrackReport.onCreated(function () {
  this.autorun(() => {
    let selector = _.pick(Template.currentData(), 'type', 'id');
    if (!selector.id) selector.id = null;
    this.fastTrackSub = FastTrack.subscribe(selector, {limit: 1});
  });
});

Template.FastTrackReport.onDestroyed(function () {
  if (this.fastTrackSub) this.fastTrackSub.stop();
});
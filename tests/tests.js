describe('FastTrack', () => {
  describe('collection', () => {

    beforeEach(() => {
      spyOn(Mongo, 'Collection').and.returnValue({
        _ensureIndex: function () {}
      });
      spyOn(MongoInternals, 'RemoteCollectionDriver').and.returnValue(undefined);
    });

    it('creates a fast_track collection', () => {
      delete process.env.FAST_TRACK_MONGO_URL;
      delete process.env.FAST_TRACK_MONGO_OPLOG_URL;
      initialize();

      expect(Mongo.Collection).toHaveBeenCalledWith('fast_track');
    });

    it('uses alternative URLs for fast_track collection driver', () => {
      process.env.FAST_TRACK_MONGO_URL = 'MONGO_URL';
      process.env.FAST_TRACK_MONGO_OPLOG_URL = 'MONGO_OPLOG_URL';
      initialize();

      expect(MongoInternals.RemoteCollectionDriver).toHaveBeenCalledWith('MONGO_URL', {
        oplogUrl: 'MONGO_OPLOG_URL'
      });

      expect(Mongo.Collection).toHaveBeenCalledWith('fast_track', {
        _driver: jasmine.any(MongoInternals.RemoteCollectionDriver)
      });
    });

  });
});

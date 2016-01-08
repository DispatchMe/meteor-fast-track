# dispatch:fast-track

A Meteor package that provides an easy way of tracking everything that happens to an entity, over time and across various servers and apps.

FastTrack allows you to:

* log events to your Mongo database by entity type and ID, or just by type.
* log from server or client code.
* add a hyperlink and arbitrary data to the event you log
* easily display all events for a type or type+id on the client

## Installation

```bash
$ meteor add dispatch:fast-track
```

## Usage

### Log an Event By Type

```js
FastTrack.log({
  type: 'reminderEmails',
  message: 'Sent'
});
```

### Log an Event By Type and ID

```js
FastTrack.log({
  type: 'widget',
  id: '1',
  message: 'Created'
});
```

### Add More Details

Add `time` to log a time other than the default of now:

```js
FastTrack.log({
  time: new Date(Date.now() - 60000)
});
```

Add `link` to store a link to more information about this event:

```js
FastTrack.log({
  link: 'https://my.domain.com/widgets/1'
});
```

Add `data` to store any arbitrary data related to this event:

```js
FastTrack.log({
  data: {
    createdBy: someUserId
  }
});
```

### Get All Events By Type

```js
let events = FastTrack.get({type: 'reminderEmails'});
```

### Get All Events By Type and ID

```js
let events = FastTrack.get({type: 'widget', id: '1'});
```

### Do Some Other Query

The MongoDB collection is exported as `FastTrack.Collection`, so you can query it as needed.

### Read or Write Events from Client Code

If you want to use `FastTrack.log` or `FastTrack.get` in client code, you must first call `FastTrack.configure` in server code and provide read and write security functions that return `true` if it should be allowed.

```js
FastTrack.configure({
  allowWrite: (userId, info) => { return !!userId; },
  allowRead: (userId, selector) => { return !!userId; },
});
```

On the client, `FastTrack.log` takes an optional callback if you need to make sure that the logging succeeded.

Also, for `FastTrack.get()` to be able to return results, you will need to subscribe to the necessary data first. You can use `FastTrack.subscribe` to do this:

```js
FastTrack.subscribe({type: 'user', id: '1'}, () => {
  let events = FastTrack.get({type: 'user', id: '1'});
})
```

### Display Events in Client HTML

To render a report:

```
{{> FastTrackReport type="user" id="1"}}
```

The report has no styles applied so you can skin it to match your UI.

`FastTrackReport` will automatically subscribe to the necessary data. Just make sure you have set an `allowRead` function in your server code by calling `FastTrack.configure`.

### Use an alternative MongoDB database

You may not want to store so many logs in your main app database. FastTrack allows you to specify a different MongoDB URL to use for the `fast_track` collection by setting environment variables:

```
FAST_TRACK_MONGO_URL
FAST_TRACK_MONGO_OPLOG_URL
```

`FAST_TRACK_MONGO_OPLOG_URL` is optional but recommended if you are publishing and displaying the logs on clients.

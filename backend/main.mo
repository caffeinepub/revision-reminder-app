import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Migration "migration";

(with migration = Migration.run)
actor {
  type ReminderInterval = {
    intervalLabel : Text;
    days : Int;
  };

  let intervals : [ReminderInterval] = [
    { intervalLabel = "1-day"; days = 1 },
    { intervalLabel = "3-day"; days = 3 },
    { intervalLabel = "7-day"; days = 7 },
    { intervalLabel = "1-month"; days = 30 },
    { intervalLabel = "3-month"; days = 90 },
  ];

  var topics : [Text] = [];
  var reminders : [(Text, Time.Time, Text)] = [];
  var studyLogs : [(Time.Time, Nat)] = [];

  func findIntervalByLabel(intervalLabel : Text) : ?ReminderInterval {
    intervals.find(func(i) { i.intervalLabel == intervalLabel });
  };

  public shared ({ caller }) func addTopic(name : Text) : async () {
    switch (topics.find(func(t) { t == name })) {
      case (?_) { Runtime.trap("Topic already exists.") };
      case (null) {
        topics := topics.concat([name]);
        for (interval in intervals.values()) {
          let newReminder = (name, Time.now(), interval.intervalLabel);
          reminders := reminders.concat([newReminder]);
        };
      };
    };
  };

  public query ({ caller }) func getTopics() : async [Text] {
    topics;
  };

  public query ({ caller }) func getDueReminders() : async [(Text, Text)] {
    let now = Time.now();
    let dueReminders = reminders.filter(func(r) {
      let (topic, created, interval) = r;
      switch (findIntervalByLabel(interval)) {
        case (null) { false };
        case (?intervalObj) {
          let intervalNanos = intervalObj.days * 24 * 3600 * 1_000_000_000;
          now >= created + intervalNanos;
        };
      };
    });
    dueReminders.map(func(r) { (r.0, r.2) });
  };

  public shared ({ caller }) func markReminderDone(topicName : Text, interval : Text) : async () {
    switch (topics.find(func(t) { t == topicName })) {
      case (null) { Runtime.trap("Topic does not exist.") };
      case (?_) {
        switch (findIntervalByLabel(interval)) {
          case (null) { Runtime.trap("Invalid interval.") };
          case (?_) {
            reminders := reminders.filter(
              func(r) { r.0 != topicName or r.2 != interval }
            );
            reminders := reminders.concat([(topicName, Time.now(), interval)]);
            studyLogs := studyLogs.concat([(Time.now(), 1)]);
          };
        };
      };
    };
  };

  public query ({ caller }) func getStudyProgress() : async [(Time.Time, Nat)] {
    studyLogs;
  };
};

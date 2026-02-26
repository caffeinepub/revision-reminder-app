import Array "mo:core/Array";
import Time "mo:core/Time";

module {
  type OldReminderInterval = {
    intervalLabel : Text;
    days : Int;
  };

  type OldActor = {
    intervals : [OldReminderInterval];
    topics : [Text];
    reminders : [(Text, Time.Time, Text)];
    studyLogs : [(Time.Time, Nat)];
  };

  type NewReminderInterval = {
    intervalLabel : Text;
    days : Int;
  };

  type NewActor = {
    intervals : [NewReminderInterval];
    topics : [Text];
    reminders : [(Text, Time.Time, Text)];
    studyLogs : [(Time.Time, Nat)];
  };

  func updateReminders(reminders : [(Text, Time.Time, Text)]) : [(Text, Time.Time, Text)] {
    reminders.map(
      func(reminder) {
        let (topic, timestamp, intervalLabel) = reminder;
        switch (intervalLabel) {
          case ("30-day") { (topic, timestamp, "1-month") };
          case (_) { reminder };
        };
      }
    );
  };

  public func run(old : OldActor) : NewActor {
    let newIntervals : [NewReminderInterval] = [
      { intervalLabel = "1-day"; days = 1 },
      { intervalLabel = "3-day"; days = 3 },
      { intervalLabel = "7-day"; days = 7 },
      { intervalLabel = "1-month"; days = 30 },
      { intervalLabel = "3-month"; days = 90 },
    ];

    let updatedReminders = updateReminders(old.reminders);

    {
      intervals = newIntervals;
      topics = old.topics;
      reminders = updatedReminders;
      studyLogs = old.studyLogs;
    };
  };
};

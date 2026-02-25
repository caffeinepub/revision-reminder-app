import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface backendInterface {
    addTopic(name: string): Promise<void>;
    getDueReminders(): Promise<Array<[string, string]>>;
    getStudyProgress(): Promise<Array<[Time, bigint]>>;
    getTopics(): Promise<Array<string>>;
    markReminderDone(topicName: string, interval: string): Promise<void>;
}

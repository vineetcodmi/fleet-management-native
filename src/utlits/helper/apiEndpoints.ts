export const API_ENDPOINTS = {
    TOKEN: {
        token: "/token",
    },
    UNIT: {
        logon: "/unit/logon",
        logoff: "/unit/logoff",
        unit: "/unit",
        monitor: "/unit/monitor",
        statuscodes: "/unit/statuscodes",
        location: "/unit/livelocation"
    },
    EVENT: {
        event: "/event",
        monitor: "/event/monitor",
        eventTypes: "/event/eventtypes",
        createEvent: "/event/create",
        statuscodes: "/event/statuscodes",
        addComment: "/comment",
        update: "/update"
    }
}
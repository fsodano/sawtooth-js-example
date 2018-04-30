import protobuf from 'sawtooth-sdk/protobuf';

subscription = protobuf.EventSubscription({
  event_type = 'sawtooth/state-delta',
  filters = [
    # Filter to only addresses in the 'xo' namespace using a regex
    EventFilter(
      key = 'address',
      match_string = '5b7349.*',
      filter_type = EventFilter.REGEX_ANY)
  ]
});
#ifndef _INCLUDE_JS_
#define _INCLUDE_JS_

#ifdef DEBUG
function assert(condition, message) {
  if (!condition) {
    console.log(message);
  }
};

#define ASSERT(x, y) assert(x, y)
#define LOG(x) { console.log(x) };
#else
#define ASSERT(x, y)
#define LOG(x)
#endif /* DEBUG */

#ifdef PROFILE
var profileNames = new Array();
function time(name) {
  profileNames.push(name);
  console.time(name);
};
function time_end() {
  var name = profileNames.pop();
  console.timeEnd(name);
};

#define TIME(x) time(x);
#define TIME_END() time_end();
#define COUNT(x) console.count(x);
#define TRACE() console.trace();
#else
#define TIME(x)
#define TIME_END(x)
#define COUNT(x)
#define TRACE()
#endif /* PROFILE */

#endif /* INCLUDE_JS */
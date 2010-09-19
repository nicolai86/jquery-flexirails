#ifndef _INCLUDE_JS_
#define _INCLUDE_JS_

#ifdef DEBUG
function assert(condition, message) {
  console.log("fuu");
}
#define ASSERT(x, y) assert(x, y)
#else
#define ASSERT(x, y)
#endif

#endif
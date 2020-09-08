## Dual N-Back training

Personal project to build a JS Dual N-Back training app

[Demo here](https://danfarrow.github.io/dualnback/)

### What is dual n-back training?

For my purposes it’s a tool for exercising & training my working memory, but I couldn’t say for sure if it’s had any benefit yet. However, making this app in JavaScript has been a useful exercise!

https://en.wikipedia.org/wiki/N-back#Dual_n-back

### Instructions

You will be shown a series of coloured squares. Each time the square changes you will be mentally comparing it with the square 2 steps back to determine if the colour or position (or both) match.

Press the __Q__ key to report a colour match and __E__ for a position match.

For example:

* Round 1: Red square, top left - no previous round to compare
* Round 2: Blue square, top right - no previous round to compare
* Round 3: Red square, top right - compare with round 1: colour match
* Round 4: Red square, top right - compare with round 2: position match
* Round 5: Yellow square, bottom right - compare with round 3: no match
* Round 6: Red square, top right - compare with round 4: colour & position match

### Scoring

Each correctly reported match scores 1 point. Each incorrectly reported match or unreported match loses 1 point.

After 20 rounds your score will display along with the possible score.

### @todo
* Add onscreen buttons for touchscreen
* [Use webpack for full build](https://webpack.js.org/guides/asset-management/)

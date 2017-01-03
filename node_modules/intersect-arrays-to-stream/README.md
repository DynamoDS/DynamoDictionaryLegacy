# intersect-arrays-to-stream
Takes an arbitrary amount of sorted arrays and returns the intersect as a stream

```javascript
  var iats = require('intersect-arrays-to-stream')
  
  var arr = [
    "Lorem ipsum dolor sit amet, ea movet euismod deserunt sed. Te has doming antiopam postulant.".split(' ').sort(),
    "Lorem ipsum dolor sit amet, ea movet euismod deserunt sed.".split(' ').sort(),
    "ea movet euismod deserunt sed. Te has doming antiopam postulant.".split(' ').sort()
  ]
  
  iats.getIntersectionStream(arr).pipe(process.stdout)       // deserunteaeuismodmovetsed.
```

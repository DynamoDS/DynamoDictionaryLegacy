export function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length != b.length) return false;
  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}
//
// export default function testEquality(a,b){
//   if(b){
//     if(arraysEqual(a.Lineage,b.Lineage) && a.Name === b.Name){
//       return true;
//     }
//   }
// }

export function flattenHierarchy(li){
  if(!li.Arr){return li}
  let arr = li.Arr.map((l)=>{
    if(l.Arr){return l.Arr.map(flattenHierarchy)}
    else{
      return l;
    }
  })
  return arr;
}
export function flatten(arr) {
  return arr.reduce(function(flat, toFlatten) {
      return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
  }, []);
}


export default function idTest(a,b){
  if(a&&b){
    if(a.Name===b.Name && a.iteration===b.iteration && a.iterationId===b.iterationId){
      return true;
    }
  }
}

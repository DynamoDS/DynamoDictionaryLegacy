export default function lineageToRoute(node){

  if(node.Lineage){
    return (node.Lineage.length>0?node.Lineage.concat(node.Name).join('/'):node.Name)
  }
  else{
    return (node.Categories.concat([node.Group,node.Name]).join('/'))
  }
}



/**
 * 本地存储对象，慎重考虑兼容性
 */
export default class Storage_Game_Map {
  constructor(m){
    let map = 
    { 
      id: 1001, 
      columns: 3, 
      rows: 3, 
      mat:  // type
      [ 
        [['wall'], ['iron'], ['flat']], 
        [['flat'], ['flat'], ['flat']], 
        [['flat'], ['wall'], ['iron']]
      ] 
    } 
  }
}
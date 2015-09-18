/*
* Inline script loader
* https://github.com/ytiurin/inlinescriptloader.js
*
* The MIT License (MIT)
* https://github.com/ytiurin/inlinescriptloader.js/blob/master/LICENSE
*
* September 18, 2015
*/

'use strict';

!function(){
var zz=0;
  var

  //configs
  importPtrn='"import ',

  //internal objects aliases
  storage,cl=console,

  //properties names
  nmError='error',nmLength='length',nmPush='push',nmSplice='splice',
  nmIndexOf='indexOf',nmSubstring='substring',nmGetItem='getItem',
  nmSetItem='setItem',nmResponceURL='responseURL',
  nmResponceText='responseText',nmGetResponceHeader='getResponseHeader',
  nmLastModif="last-modified",nmMessage='message',
  nmDependencies='dependencies',nmOrder='order';

  function isFailStatus(status)
  {
    return -1<[4,5][nmIndexOf](parseInt(status/100));
  }

  function performRequest(type,path,data,onload)
  {
    var rq=new XMLHttpRequest;
    rq.data=data;
    rq.onload=onload;
    rq.open(type,path,true);
    rq.send();
  }

  function parseForDI(text)
  {
    var dependencies=[];

    //retrieve dependencies
    var t=text.replace(/'|"/g,'"');
    var p1,p2,dp,words;

    for(;-1<(p1=t[nmIndexOf](importPtrn,p1));p1=p2+1){
      dp={};
      p2=t[nmIndexOf]('"',p1+1);
      words=t[nmSubstring](p1,p2).split(' ');
      if(words[1]){
        dp.path=words[1];
        if(words[2]==='from'&&words[3]){
          dp.name=words[1];
          dp.path=words[3];
        }

      }
      dependencies.splice(0,0,dp);
    }

    return dependencies;
  }

  function loadScriptBody(path,continueHandler)
  {
    performRequest("get",path,{path:path},
      function(){
        if(!isFailStatus(this.status)){
          //store script
          if(confCache&&storage){
            try{
              storage[nmSetItem](path+'[text]',this[nmResponceText]);
              storage[nmSetItem](path+'[time]',this[nmGetResponceHeader](
                nmLastModif));
            }
            catch(e){
              cl.warn('Caching script failed because: '+e[nmMessage]);
            }
          }

          continueHandler.call(this);
        }
        else
          cl[nmError]('Failed loding '+path+': '+this.statusText);
      });
  }

  function retrieveScriptByPath(path)
  {
    console.log('KK '+(zz++),path)

    loadScriptBody(path,function(){
      var scriptData={};
      scriptData.path=this.data.path;
      scriptData.text=this[nmResponceText];
      scriptData[nmDependencies]=parseForDI(this[nmResponceText]);
      scriptQueue[nmSplice](0,0,scriptData);

      console.table(scriptQueue);
      console.log(pathOrder);

      var ioPath,ioParentPath,chPath;
      for(var i=scriptData[nmDependencies][nmLength];i--;){
        chPath=scriptData[nmDependencies][i].path;
        ioParentPath=pathOrder.indexOf(path);
        if(-1<(ioPath=pathOrder.indexOf(chPath))){
          if(ioPath>ioParentPath){
            pathOrder[nmSplice](ioPath,1);
            pathOrder[nmSplice](ioParentPath,0,chPath);
          }
        }
        else{
          pathOrder[nmSplice](ioParentPath,0,chPath);
          retrieveScriptByPath(chPath);
        }
      }
    });
  }

  // program start
  try{
    storage=localStorage;
  }
  catch(e){
    cl.warn('Caching disabled because: '+e[nmMessage]);
  }

  var userCallback;
  var confCache,confDebug;
  var undef;
  var args=arguments;

  var scriptQueue=[];

  if(args[1]){
    if(typeof args[1]==='function')
      userHandler=args[1];
    else {
      if(undef===(confCache=args[1].cache))
        confCache=true;
      if(undef===(confDebug=args[1].debug))
        confDebug=false;
    }
  }

  if(args[2])
    userCallback=args[2];

  var pathOrder=args[0][nmSplice]&&args[0][nmSplice](0)||args[0];
  for(var i=pathOrder.length;i--;)
    retrieveScriptByPath(pathOrder[i]);

}(['/app/myapp.js'
  ,'/app/post.js'
  ],{
  cache:false,
  debug:true
},function(myApp){
  // myApp.launch()

  $(function(){
    $(document.body).append('<p>The execution order should be ONE > TWO > THREE > MAIN > POST </p>');

    $(document.body).append('<p>Loading time: '+(Date.now()-startTime)+'ms</p>');
  });
})

var startTime=Date.now();

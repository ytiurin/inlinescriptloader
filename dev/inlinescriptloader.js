/*
* Inline script loader v0.2
* https://github.com/ytiurin/inlinescriptloader.js
*
* The MIT License (MIT)
* https://github.com/ytiurin/inlinescriptloader.js/blob/master/LICENSE
*
* September 20, 2015
*/

'use strict';

(function(){

  var

  //configs
  importPtrn='"import ',

  //internal objects aliases
  undef,storage,cl=console,

  //properties names
  nmError='error',nmLength='length',nmSplice='splice',nmIndexOf='indexOf',
  nmResponceText='responseText',nmGetResponceHeader='getResponseHeader',
  nmLastModif="last-modified",nmMessage='message',nmPath='path',
  nmDependencies='dependencies';

  function mapIndexOf(array,key,value)
  {
    for(var r=-1,i=array[nmLength];i--;)
      if(array[i][key]===value){
        r=i;break;}
    return r;
  }

  function isFailStatus(status)
  {
    return -1<[4,5][nmIndexOf](parseInt(status/100));
  }

  function performRequest(type,path,data,onload)
  {
    var rq=new XMLHttpRequest;
    rq[nmPath]=path;
    rq.d=data;
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
      words=t.substring(p1,p2).split(' ');
      if(words[1]){
        dp[nmPath]=words[1];
        if(words[2]==='from'&&words[3]){
          dp.name=words[1];
          dp[nmPath]=words[3];
        }

      }
      dependencies[nmSplice](0,0,dp);
    }

    return dependencies;
  }

  function loadScriptBody(path,continueHandler)
  {
    var confCache=this.ch;

    performRequest("get",path,{},
      function(){
        var rq=this;

        if(!isFailStatus(rq.status)){
          //store script
          if(confCache&&storage){
            try{
              storage.setItem(path+'[text]',rq[nmResponceText]);
              storage.setItem(path+'[time]',rq[nmGetResponceHeader](
                nmLastModif));
            }
            catch(e){
              cl.warn('Caching script failed because: '+e[nmMessage]);
            }
          }

          continueHandler.call(rq);
        }
        else
          cl[nmError]('Failed loading '+path+': '+rq.statusText);
      });
  }

  function executeScriptQueue(pathOrder,scriptQueue)
  {
    for(var l=0;l<pathOrder[nmLength];l++){
      var i=mapIndexOf(scriptQueue,nmPath,pathOrder[l]);

      //prepare arguments
      var argNames=[],argValues=[];
      var dependencies=scriptQueue[i][nmDependencies];
      for(var j=0;j<dependencies[nmLength];j++)
        if(dependencies[j].name){
          var k=mapIndexOf(scriptQueue,nmPath,dependencies[j][nmPath]);
          argNames[nmSplice](0,0,dependencies[j].name);
          argValues[nmSplice](0,0,scriptQueue[k].result);
        }

      //create function and try execute script
      var p=new Function(argNames,scriptQueue[i].text);

      try{
        scriptQueue[i].result=p.apply({},argValues);
      }
      catch(e){
        cl[nmError]('Error executing script '+scriptQueue[i].url+': '+
          e[nmMessage]);
      }
    }

    //execute user handler
    try{
      this.uc&&this.uc(scriptQueue[0].result);
    }
    catch(e){
      cl[nmError]('Error executing user callback: '+e[nmMessage]);
    }
  }

  function loader()
  {
    function outputDebug()
    {
      if(confDebug&&unretrievedCount<1&&lateCacheCount<1){
        cl.log(pathOrder);
        cl.table(scriptQueue);
      }
    }

    function applyScriptBody(path,text,source)
    {
      var scriptData={};
      scriptData[nmPath]=path;
      scriptData.text=text;
      scriptData[nmDependencies]=parseForDI(text);
      scriptData.source=source;
      scriptQueue[nmSplice](0,0,scriptData);

      var ioPath,ioParentPath,chPath;
      for(var i=scriptData[nmDependencies][nmLength];i--;){
        chPath=scriptData[nmDependencies][i][nmPath];
        ioParentPath=pathOrder[nmIndexOf](path);
        if(-1<(ioPath=pathOrder[nmIndexOf](chPath))){
          if(ioPath>ioParentPath){
            pathOrder[nmSplice](ioPath,1);
            pathOrder[nmSplice](ioParentPath,0,chPath);
          }
        }
        else{
          unretrievedCount++;
          pathOrder[nmSplice](ioParentPath,0,chPath);
          retrieveScriptByPath(chPath);
        }
      }

      if(--unretrievedCount<1){
        outputDebug();
        executeScriptQueue.bind({uc:userCallback})(pathOrder,scriptQueue);
      }
    }

    function retrieveScriptByPath(path)
    {
      var ltext,ltime;

      if(confCache&&storage&&
      //get script from storage
      (ltext=storage.getItem(path+'[text]'))!==null&&
      (ltime=storage.getItem(path+'[time]'))!==null){

        applyScriptBody(path,ltext,'local');

        //compare local and remote script time
        lateCacheCount++;
        performRequest("head",path,{time:ltime},
          function(){
            var rq=this;

            // if status is fail, or cache expired
            if(!isFailStatus(rq.status)&&
            rq[nmGetResponceHeader](nmLastModif)!==rq.d.time)

              myLoadScriptBody(rq[nmPath],function(){
                var i;
                if(-1<(i=mapIndexOf(scriptQueue,nmPath,rq[nmPath])))
                  scriptQueue[i].source='late remote';

                lateCacheCount--;
                outputDebug();
              });
            else{
              lateCacheCount--;
              outputDebug();
            }
          });
      }
      else
        myLoadScriptBody(path,function(){
          applyScriptBody(this[nmPath],this[nmResponceText],'remote');
        });
    }

    var userCallback;
    var confCache,confDebug;
    var args=arguments;
    var unretrievedCount=0,lateCacheCount=0;

    var scriptQueue=[];

    if(args[1]){
      if(typeof args[1]==='function')
        userCallback=args[1];
      else {
        if(undef===(confCache=args[1].cache))
          confCache=true;
        if(undef===(confDebug=args[1].debug))
          confDebug=false;
      }
    }

    if(args[2])
      userCallback=args[2];

    var myLoadScriptBody=loadScriptBody.bind({ch:confCache});
    var pathOrder=args[0][nmSplice]&&args[0][nmSplice](0)||args[0];
    unretrievedCount=pathOrder[nmLength];
    for(var i=pathOrder[nmLength];i--;)
      retrieveScriptByPath(pathOrder[i]);
  }

  // <<<<<< start >>>>>>
  try{
    storage=localStorage;
  }
  catch(e){
    cl.warn('Caching disabled because: '+e[nmMessage]);
  }

  loader.apply(this,arguments);

  return loader;

})(['/app/myapp.js'
  ,'/app/post.js'
  ],{
  cache:false,
  debug:true
},function(myApp){

  $(function(){
    $(document.body).append('<p>The execution order should be ONE > TWO > THREE > MAIN > POST </p>');

    $(document.body).append('<p>Loading time: '+(Date.now()-startTime)+'ms</p>');
  });
})

var startTime=Date.now();

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

(function(){

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

  function mapIndexOf(array,key,value)
  {
    for(var r=-1,i=array.length;i--;)
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
    var confCache=this.ch;

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
          cl[nmError]('Failed loading '+path+': '+this.statusText);
      });
  }

  function executeScriptQueue(pathOrder,scriptQueue)
  {
    for(var l=0;l<pathOrder[nmLength];l++){
      for(var i=scriptQueue[nmLength];i--;)
        if(scriptQueue[i].path===pathOrder[l])
          break;

      //prepare arguments
      var argNames=[],argValues=[];
      var dependencies=scriptQueue[i][nmDependencies];
      for(var j=0;j<dependencies[nmLength];j++)
        for(var k=scriptQueue[nmLength];k--;)
          if(dependencies[j].path===scriptQueue[k].path&&dependencies[j].name){
            argNames[nmSplice](0,0,dependencies[j].name);
            argValues[nmSplice](0,0,scriptQueue[k].result);
            break;
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
    function applyScriptBody(path,text,source)
    {
      var scriptData={};
      scriptData.path=path;
      scriptData.text=text;
      scriptData[nmDependencies]=parseForDI(text);
      scriptData.source=source;
      scriptQueue[nmSplice](0,0,scriptData);

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
          unretrievedCount++;
          pathOrder[nmSplice](ioParentPath,0,chPath);
          retrieveScriptByPath(chPath);
        }
      }

      if(--unretrievedCount<1){
        if(confDebug){
          cl.log(pathOrder);
          cl.table(scriptQueue);
        }
        executeScriptQueue.bind({uc:userCallback})(pathOrder,scriptQueue);
      }
    }

    function retrieveScriptByPath(path)
    {
      var ltext,ltime;

      if(confCache&&storage&&
      //get script from storage
      (ltext=storage[nmGetItem](path+'[text]'))!==null&&
      (ltime=storage[nmGetItem](path+'[time]'))!==null){

        applyScriptBody(path,ltext,'local');

        //compare local and remote script time
        performRequest("head",path,{path:path},
          function(){
            // if status is fail, or cache expired
            if(!isFailStatus(this.status)&&
            this[nmGetResponceHeader](nmLastModif)!==ltime)
              myLoadScriptBody(this.data.path,function(){
                var i;
                if(-1<(i=mapIndexOf(scriptQueue,'path',this.data.path)))
                  scriptQueue[i].source='late remote';
              });
          });
      }
      else
        myLoadScriptBody(path,function(){
          applyScriptBody(this.data.path,this[nmResponceText],'remote');
        });
    }

    var userCallback;
    var confCache,confDebug;
    var undef;
    var args=arguments;
    var unretrievedCount=0;

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
    unretrievedCount=pathOrder.length;
    for(var i=pathOrder.length;i--;)
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
  // cache:false,
  debug:true
},function(myApp){
  // myApp.launch()

  $(function(){
    $(document.body).append('<p>The execution order should be ONE > TWO > THREE > MAIN > POST </p>');

    $(document.body).append('<p>Loading time: '+(Date.now()-startTime)+'ms</p>');
  });
})

var startTime=Date.now();

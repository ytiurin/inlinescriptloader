/*
* Inline script loader
* https://github.com/ytiurin/inlinescriptloader.js
*
* The MIT License (MIT)
* https://github.com/ytiurin/inlinescriptloader.js/blob/master/LICENSE
*
* September 14, 2015
*/

'use strict';

!function(){

var

//configs
importPtrn='"import ',

//state variables
pathStack=[],scriptQueue=[],pathMap={},rqOrder=0,activeRequests=0,whenRequestsDone,

//internal objects aliases
args=arguments,storage,cl=console,

//properties names
nmError='error',nmLength='length',nmPush='push',nmSplice='splice',
nmIndexOf='indexOf',nmSubstring='substring',nmGetItem='getItem',
nmSetItem='setItem',nmResponceURL='responseURL',
nmResponceText='responseText',nmGetResponceHeader='getResponseHeader',
nmLastModif="last-modified",nmMessage='message',nmDependencies='dependencies',
nmOrder='order';

function isFailStatus(status)
{
  return -1<[4,5][nmIndexOf](parseInt(status/100));
}

function performRequest(type,path,handler)
{
  var rq=new XMLHttpRequest;
  rq[nmOrder]=rqOrder++;
  rq.onload=function(){
    activeRequests--;
    handler.apply(this,arguments);
    activeRequests<1&&whenRequestsDone&&whenRequestsDone();
  };
  // anticache parameter affects on already loaded scripts usage effeciency
  // '?'+(new Date().getTime())
  rq.open(type,path,true);

  activeRequests++
  rq.send();
}

function retrieveDependenciesAndContinue(scriptData)
{
  var dependencies=[];

  //remove repeating dependency
  for(var i=scriptQueue[nmLength];i--;)
    if(scriptQueue[i].url===scriptData.url)
      scriptQueue[nmSplice](i,1);

  //retrieve dependencies
  var t=scriptData.text.replace(/'|"/g,'"');
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
      pathStack[nmSplice](0,0,dp.path);
    }
  }

  scriptData[nmDependencies]=dependencies;
  scriptQueue[nmSplice](0,0,scriptData);

  if(activeRequests<1)
    iterateScriptLoad();
}

function loadScriptBody(path,continueHandler)
{
  performRequest("get",path,
    function(){
      if(!isFailStatus(this.status)){
        //store script
        if(userConf.cache&&storage){
          try{
            storage[nmSetItem](path+'[url]',this[nmResponceURL]);
            storage[nmSetItem](path+'[text]',this[nmResponceText]);
            storage[nmSetItem](path+'[time]',this[nmGetResponceHeader](
              nmLastModif));
          }
          catch(e){
            cl.warn('Caching script failed because: '+e[nmMessage]);
          }
        }

        continueHandler&&continueHandler.call(this);
      }
      else
        cl[nmError]('Failed loding '+path+': '+this.statusText);
    });
}

function retrieveScriptFromCache(path)
{
  var lurl,ltext,ltime,

  scriptCached=userConf.cache&&storage&&
    //get script from storage
    (lurl=storage[nmGetItem](path+'[url]'))!==null&&
    (ltext=storage[nmGetItem](path+'[text]'))!==null&&
    (ltime=storage[nmGetItem](path+'[time]'))!==null;

  if(scriptCached){
    retrieveDependenciesAndContinue({order:rqOrder++,url:lurl,text:ltext,
      source:'local'});

    //compare local and remote script time
    scriptCached&&performRequest("head",path,
      function(){
        var cacheExpired=this[nmGetResponceHeader](nmLastModif)!==ltime;

        if(!isFailStatus(this.status)&&cacheExpired)
          loadScriptBody(path,function(){
            var i;

            if(-1<(i=scriptQueue.map(function(i){return i.url}).indexOf(
              this[nmResponceURL])))
              scriptQueue[i].source='late remote';
          });
      });
  }

  return scriptCached;
}

function iterateScriptLoad()
{
  if(pathStack[nmLength]){
    for(var path;pathStack[nmLength];){
      //fill script stack
      path=pathStack[nmSplice](0,1);

      retrieveScriptFromCache(path)
        ||
      loadScriptBody(path,function(){
        retrieveDependenciesAndContinue({order:this[nmOrder],
          url:this[nmResponceURL],text:this[nmResponceText],source:'remote'});
      });
    }
  }
  else{
    //execute script stack
    scriptQueue=scriptQueue.sort(function(a,b){return a[nmOrder]<b[nmOrder]});
    var r,p,dps;
    for(var i=0;i<scriptQueue[nmLength];i++){
      //prepare arguments
      dps=scriptQueue[i][nmDependencies];
      r={aNs:[],aVs:[]};

      for(var j=0;j<dps[nmLength];j++)
        for(var k=scriptQueue[nmLength];k--;)
          if(pathMap[dps[j].path]===scriptQueue[k].url){
            r.aNs[nmPush](dps[j].name)
            r.aVs[nmPush](scriptQueue[k].result);
            break;
          }

      //create function and try execute script
      p=new Function(r.aNs,scriptQueue[i].text);

      try{
        scriptQueue[i].result=p.apply({},r.aVs);
      }
      catch(e){
        cl[nmError]('Error executing script '+scriptQueue[i].url+': '+
          e[nmMessage]);
      }
    }

    //execute user handler
    try{
      userHandler&&userHandler(scriptQueue[0].result);
    }
    catch(e){
      cl[nmError]('Error executing user callback: '+e[nmMessage]);
    }

    whenRequestsDone=function(){
      userConf.debug&&cl.table(scriptQueue);
    };
  }
}

// program start
try{
  storage=localStorage;
}
catch(e){
  cl.warn('Caching disabled because: '+e[nmMessage]);
}

var userPath=args[0],userConf={},userHandler;
if(userPath){
  if(Array.isArray(userPath))
    pathStack=userPath[nmSplice](0).reverse();
  else
    pathStack[nmSplice](0,0,userPath);

  if(args[1]){
    if(typeof args[1]==='function')
      userHandler=args[1];
    else
      userConf=args[1];
  }

  if(args[2])
    userHandler=args[2];

  if(userConf.cache===undefined)
    userConf.cache=true;

  iterateScriptLoad();
}

}(['/app/myapp.js'
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

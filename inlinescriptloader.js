/*
* Inline script loader
* https://github.com/ytiurin/inlinescriptloader.js
*
* The MIT License (MIT)
* https://github.com/ytiurin/inlinescriptloader.js/blob/master/LICENSE
*
* September 7, 2015
*/

!function(userPath,conf){

var pathStack=[],loadedScripts=[],pathMap={},rq=new XMLHttpRequest,importPtrn='"import ',cl=console,nmLength='length',nmPush='push',nmIndexOf='indexOf',nmSubstring='substring',storage=localStorage,nmGetItem='getItem',nmSetItem='setItem',nmResponceURL='responseURL',nmResponceText='responseText',nmGetResponceHeader='getResponseHeader',nmLastModif="last-modified";

function request(type,path,handler)
{
  rq.onload=handler;
  // anticache parameter affects on already loaded scripts usage effeciency
  // '?'+(new Date().getTime())
  rq.open(type,path,true);
  rq.send();
}

function scriptRetriever(url,text,source)
{
  var dependencies=[];

  //remove repeating dependency
  for(var i=loadedScripts[nmLength];i--;)
    if(loadedScripts[i].url===url)
      loadedScripts.splice(i,1);

  //retrieve dependencies
  var t=text.replace(/'|"/g,' "');
  var m,o,dp;

  for(;(m=t[nmIndexOf](importPtrn,m))>-1;){
    dp={};
    m+=importPtrn[nmLength];
    o=t[nmIndexOf](' ',m);
    dp.path=t[nmSubstring](m,o);
    pathStack[nmPush](dp.path);
    m=o+1;
    o=t[nmIndexOf](' ',m);
    if(t[m]!=='"'){
      dp.name=t[nmSubstring](m,o);
      dependencies[nmPush](dp);
    }
  }

  loadedScripts[nmPush]({url:url,text:text,dependencies:dependencies,source:source});
  iterateScriptLoad();
}

function loadScriptBody(path)
{
  request("get",path,function(){
    //store script
    if(conf.cache&&storage){
      storage[nmSetItem](path+'[url]',this[nmResponceURL]);
      storage[nmSetItem](path+'[text]',this[nmResponceText]);
      storage[nmSetItem](path+'[time]',this[nmGetResponceHeader](nmLastModif));
    }

    scriptRetriever(this[nmResponceURL],this[nmResponceText],'remote');
  });
}

function iterateScriptLoad()
{
  if(pathStack[nmLength]){
    var path=pathStack.shift();

    var lurl,ltext,ltime;
    if(conf.cache&&storage&&
      //get script from storage
      (lurl=storage[nmGetItem](path+'[url]'))!==null&&
      (ltext=storage[nmGetItem](path+'[text]'))!==null&&
      (ltime=storage[nmGetItem](path+'[time]'))!==null){

      //compare local and remote script time
      request("head",path,function(){
        if(this[nmGetResponceHeader](nmLastModif)===ltime)
          //
          scriptRetriever(lurl,ltext,'local');
        else
          //get remote script if local exceeds time limit
          loadScriptBody(path);
      });
      return;
    }

    //get remote script if not cached
    loadScriptBody(path);
    return;
  }

  // execute script stack
  var r,p,dps;
  for(var i=loadedScripts[nmLength];i--;){
    //prepare arguments
    dps=loadedScripts[i].dependencies;
    r={aNs:[],aVs:[]};

    for(var j=0;j<dps[nmLength];j++)
      for(var k=loadedScripts[nmLength];k--;)
        if(pathMap[dps[j].path]===loadedScripts[k].url){
          r.aNs[nmPush](dps[j].name)
          r.aVs[nmPush](loadedScripts[k].result);
          break;
        }

    //create function and try execute script
    p=new Function(r.aNs,loadedScripts[i].text);

    try{
      loadedScripts[i].result=p.apply({},r.aVs);
    }
    catch(ex){
      cl&&cl.error('Error executing script '+loadedScripts[i].url+': '+
        ex.message);
    }
  }

  conf.debug&&cl&&cl.table(loadedScripts);
}

// program start
if(conf.cache===undefined)
  conf.cache=true;

if(userPath){
  if(Array.isArray(userPath))
    pathStack=userPath.splice(0);
  else
    pathStack[nmPush](userPath);

  iterateScriptLoad();
}

}('myapp.js',{
  cache:false,
  debug:true
})

/*
* Inline script loader
* https://github.com/ytiurin/inlinescriptloader.js
*
* The MIT License (MIT)
* https://github.com/ytiurin/inlinescriptloader.js/blob/master/LICENSE
*
* September 8, 2015
*/

!function(){

var pathStack=[],scriptQueue=[],pathMap={},rq=new XMLHttpRequest,
  args=arguments,importPtrn='"import ',consErr=console.error,nmLength='length',
  nmPush='push',nmSplice='splice',nmIndexOf='indexOf',nmSubstring='substring',
  storage=localStorage,nmGetItem='getItem',nmSetItem='setItem',
  nmResponceURL='responseURL',nmResponceText='responseText',
  nmGetResponceHeader='getResponseHeader',nmLastModif="last-modified";

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
  for(var i=scriptQueue[nmLength];i--;)
    if(scriptQueue[i].url===url)
      scriptQueue[nmSplice](i,1);

  //retrieve dependencies
  var t=text.replace(/'|"/g,'"');
  var p1,p2,dp,words;

  for(;(p1=t[nmIndexOf](importPtrn,p1))>-1;p1=p2+1){
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

  scriptQueue[nmSplice](0,0,{url:url,text:text,dependencies:dependencies,source:source});
  iterateScriptLoad();
}

function loadScriptBody(path)
{
  request("get",path,function(){
    if([4,5][nmIndexOf](parseInt(this.status/100))===-1){
      //store script
      if(userConf.cache&&storage){
        storage[nmSetItem](path+'[url]',this[nmResponceURL]);
        storage[nmSetItem](path+'[text]',this[nmResponceText]);
        storage[nmSetItem](path+'[time]',this[nmGetResponceHeader](nmLastModif));
      }

      scriptRetriever(this[nmResponceURL],this[nmResponceText],'remote');
    }
    else
      consErr('Failed loding '+path+': '+this.statusText);
  });
}

function iterateScriptLoad()
{
  if(pathStack[nmLength]){
    var path=pathStack[nmSplice](-1);

    var lurl,ltext,ltime;
    if(userConf.cache&&storage&&
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
  for(var i=0;i<scriptQueue[nmLength];i++){
    //prepare arguments
    dps=scriptQueue[i].dependencies;
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
    catch(ex){
      consErr('Error executing script '+scriptQueue[i].url+': '+
        ex.message);
    }
  }

  try{
    userHandler&&userHandler(scriptQueue[0].result);
  }
  catch(ex){
    consErr('Error executing user callback: '+ex.message);
  }

  userConf.debug&&console.table(scriptQueue);
}

// program start
var userPath=args[0],userConf={},userHandler;
if(userPath){
  if(Array.isArray(userPath))
    pathStack=userPath[nmSplice](0);
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

}('myapp.js',{
  cache:false,
  debug:true
},function(myApp){
  myApp.launch()
})

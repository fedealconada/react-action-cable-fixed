var Connection,message_types,bind=function(t,e){return function(){return t.apply(e,arguments)}},slice=[].slice,indexOf=[].indexOf||function(t){for(var e=0,n=this.length;e<n;e++)if(e in this&&this[e]===t)return e;return-1};message_types=require("./internal").message_types,Connection=function(){function t(t){this.consumer=t,this.open=bind(this.open,this),this.open()}return t.reopenDelay=500,t.prototype.send=function(t){return!!this.isOpen()&&(this.webSocket.send(JSON.stringify(t)),!0)},t.prototype.open=function(){if(this.webSocket&&!this.isState("closed"))throw new Error("Existing connection must be closed before opening");return this.webSocket=new WebSocket(this.consumer.url),this.installEventHandlers(),!0},t.prototype.close=function(){var t;return null!=(t=this.webSocket)?t.close():void 0},t.prototype.reopen=function(){if(this.isState("closed"))return this.open();try{return this.close()}finally{setTimeout(this.open,this.constructor.reopenDelay)}},t.prototype.isOpen=function(){return this.isState("open")},t.prototype.isState=function(){var t,e;return e=1<=arguments.length?slice.call(arguments,0):[],t=this.getState(),indexOf.call(e,t)>=0},t.prototype.getState=function(){var t,e,n;for(e in WebSocket)if(n=WebSocket[e],n===(null!=(t=this.webSocket)?t.readyState:void 0))return e.toLowerCase();return null},t.prototype.installEventHandlers=function(){var t,e;for(t in this.events)e=this.events[t].bind(this),this.webSocket["on"+t]=e},t.prototype.events={message:function(t){var e,n,i,s;switch(i=JSON.parse(t.data),e=i.identifier,n=i.message,s=i.type,s){case message_types.confirmation:return this.consumer.subscriptions.notify(e,"connected");case message_types.rejection:return this.consumer.subscriptions.reject(e);default:return e?this.consumer.subscriptions.notify(e,"received",n):this.consumer.subscriptions.notify("received",n)}},open:function(){return this.disconnected=!1,this.consumer.subscriptions.reload()},close:function(){return this.disconnect()},error:function(){return this.disconnect()}},t.prototype.disconnect=function(){if(!this.disconnected)return this.disconnected=!0,this.consumer.subscriptions.notifyAll("disconnected")},t.prototype.toJSON=function(){return{state:this.getState()}},t}(),module.exports=Connection;
(function(){
function DataBinder(object_id){
  // 创建一个简单的pubSub对象
  var pubSub = {
    callbacks: {},
    on: function(msg,callback) {
      this.callbacks[msg] = this.callbacks[msg] || [];
      this.callbacks[msg].push(callback);
    },
    publish: function(msg) {
      this.callbacks[msg] = this.callbacks[msg] || [];
      for (var i = 0,len = this.callbacks[msg].length; i < len; i++) {
        this.callbacks[msg][i].apply(this,arguments);
      }
    }
  },

      data_attr = "data-bind-" + object_id,
      message   = object_id + ":change",

      changeHandler = function(event) {
        var target    = event.target || event.srcElement, // IE8兼容
            prop_name = target.getAttribute(data_attr);

        if (prop_name && prop_name !== "") {
          pubSub.publish(message,prop_name,target.value);
        }
      };

  if (document.addEventListener) {
    document.addEventListener("keyup",changeHandler,false);
  } else{
    document.attachEvent("onkeyup",changeHandler);
  };

  pubSub.on(message,function(event,prop_name,new_val){
    var elements = document.querySelectorAll("[" + data_attr + "=" +prop_name + "]"),
        tag_name;
    for (var i = 0,len = elements.length; i < len; i++) {
      tag_name = elements[i].tagName.toLowerCase();

      if (tag_name === "input" || tag_name === "textarea" || tag_name === "select") {
        elements[i].value = new_val;
      } else{
        elements[i].innerHTML = new_val;
      };
      console.log(prop_name + "=" + new_val);
    };
  })

  return pubSub;
}

function User(uid) {
  var binder = new DataBinder(uid),
      user   = {
        attribute : {},
        set : function(attr_name,val) {
          this.attribute[attr_name] = val;
          binder.publish(uid + ":change",attr_name,val,this);
        },

        get : function(attr_name) {
          return this.attribute[attr_name];
        }
      };
  return user;
}
var user = new User( 1 );
user.set( "firstname", "l" );
user.set( "lastname", "w" );
}());
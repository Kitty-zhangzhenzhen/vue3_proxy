    // 对代理过的对象做缓存操作
    const toProxy = new WeakMap(); // 存放代理后的对象
    const toRaw = new WeakMap();  //  存放代理前的对象
    
    function triger(){
        console.log('触发视图更新');
   }

   // 判断是否是对象
   function isObject(target){
        return typeof target === 'object' && target !== null;
   }

   function reactive(target){
       if(isObject(target)){
           return target
       } 
       // 如果代理表中已经存在了，就把结果返回       let a = {name:'yp'} ; p = reactive(a) ; p = reactive(a); p = reactive(a)
       let proxy = toProxy.get(target); 
       if(proxy){  // 如果有值，就说明代理过了，直接返回
           return toProxy.get(target);
       }
       // 如果这个对象已经被代理过了，就把对象返回  let a = {name:'yp'} ; let p = reactive(a) ; p = reactive(p); p = reactive(p)
       if(toRaw.has(target)){
           return target
       }
       const handlers = {  // 触发的方法
            set(target,key,value,receiver){
                //  console.log(key)  修改数组值的时候,key有两个修改的值和length
                if(target.hasOwnProperty(key)){ // 即如果触发的是私有属性，可以直接触发视图更新,length会屏蔽掉
                    triger();
                }
                return Reflect.set(target, key, value,receiver)
            },
            get(target,key,receiver){
                const res = Reflect.get(target, key, receiver);
                if(isObject(target[key])){
                    return reactive(res)
                }
                return res;

            },
            deleteProperty(target,key){
                Reflect.deleteProperty(target, key)
            }
       }
       let observed = new Proxy(target,handlers)  // 对代理target，做handlers方法处理
       toProxy.set(target,observed) // 原对象 代理后的结果
       toRaw.set(observed,target)
       return observed
   }
   
   let obj = {
        name:'yp',
        a:[1,2,3,4]
   }

   let p = reactive(obj)

   p.name = 'yp3'

   console.log(obj)

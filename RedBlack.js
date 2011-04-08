/**
 * RedBlackJS
 *
 * Aubrey Rhodes [aubrey.c.rhodes@gmail.com]
 *
 * https://github.com/aubreyrhodes/RedBlackJS
 *
 * An effecient binary search tree.
 */
var RedBlackTree = function(){
    var BLACK = 0;
    var RED = 1;
    this.Count = 0;
    
    var m_head = null;
    
    /**
     * Trys to add the value. Returns true if added, false if the value was
     * already present.
     */
    this.tryInsert = function(value){
        
        // implementing as a loop to not worry about running out of stack frames
        var nextNode = m_head;
        var parent = null;
        
        while(nextNode){
            if(nextNode.getValue() == value){
                return false;
            }
            
            parent = nextNode;
            
            if(nextNode.getValue() > value){
                nextNode = nextNode.getLesserChild();
            }else{
                nextNode = nextNode.getGreaterChild();
            }
        }        
        
        this.Count++;
        
        // if first node, set head.  case 1
        if(!parent){
            m_head = new Node(value, null);
            return true;
        }
        
        // add the new node
        var newNode = new Node(value, parent);
        
        if(parent.getValue() > value){
            parent.setLesserChild(newNode);
        }else{
            parent.setGreaterChild(newNode);
        }
        
        var family = createFamily(newNode);
        
        insert_case1(family);
        
        return true;        
    };
    
    var createFamily = function(node){
        var parent = node.getParent();
        var gParent = parent ? parent.getParent() : null;
        var uncle = null;
        if(gParent){
            if(gParent.getValue() > parent.getValue()){
                uncle = gParent.getGreaterChild();
            }else{
                uncle = gParent.getLesserChild();
            }
        }
        
        return {
            newNode : node,
            parent : parent,
            uncle : uncle,
            gParent : gParent
        }
    };
    
    var rotate_left = function(node){
        var parent = node.getParent();
        var child  = node.getGreaterChild();
        var gChild = child ? child.getLesserChild() : null;
        
        node.setParent(child);
        node.setGreaterChild(gChild);
        
        if(child){            
            child.setParent(parent);
            child.setLesserChild(node);
        }
    };
    
    var rotate_right = function(node){
        var parent = node.getParent();
        var child  = node.getLesserChild();
        var gChild =  child ? child.getGreaterChild() : null;
        
        node.setParent(child);
        node.setLesserChild(gChild);
        
        if(child){            
            child.setParent(parent);
            child.setGreaterChild(node);
        }
    };
    
    var insert_case1 = function(family){
        if(!family.parent){
            family.newNode.setColor(BLACK);
        }else{
            insert_case2(family);
        }
    };
    
    var insert_case2 = function(family){
        if(family.parent.getColor() == BLACK){
            return;
        }
        
        insert_case3(family);
    };
    
    var insert_case3 = function(family){
        if(family.uncle && family.uncle.getColor == RED){
            family.parent.setColor(BLACK);
            family.uncle.setColor(BLACK);
            family.gParent.setColor(RED);
            insert_case1(createFamily(family.gParent));
        }else{
            insert_case4(family);
        }
    };
    
    var insert_case4 = function(family){
        if(!family.gParent)
        {
            return;
        }
        var n = family.newNode;
        if(family.newNode == family.parent.getGreaterChild()
           && family.parent == family.gParent.getLesserChild()){
            rotate_left(family.parent);
            n = family.newNode.getLesserChild();
        } else if (family.newNode == family.parent.getLesserChild()
                   && family.parent == family.gParent.getGreaterChild()){
            rotate_right(family.parent);
            n = family.newNode.getGreaterChild();
        }
        
        insert_case5(createFamily(n));
    };
    
    var insert_case5 = function(family){
        family.parent.setColor(BLACK);
        family.gParent.setColor(RED);
        if(family.newNode == family.parent.getLesserChild()
           && family.parent == family.gParent.getLesserChild()){
            rotate_right(family.gParent);
        }else{
            rotate_left(family.gParent);
        }
    };
    
  
  /**
   * Nodes in the tree.
   */
  var Node = function(value, parent){
        var m_value  = value+'';
        var m_parent = parent;
        var m_left   = null;
        var m_right  = null;
        var m_color  = BLACK;
        
        this.getValue = function(){
            return m_value;  
        };
        
        /**
         * 0 for black, 1 for red
         */
        this.getColor = function(){
            return m_color;  
        };
        
        this.setColor = function(color){
            if(color == BLACK || color == RED){
                m_color = color;
            }else{
                throw new Error("Color can be 0 or 1");
            }
        };
        
        this.getLesserChild = function(){
            return m_left;
        };
        
        this.getGreaterChild = function(){
            return m_right;
        }
        
        this.setLesserChild = function(node){
            m_left = node;
        };
        
        this.setGreaterChild = function(node){
            m_right = node;
        }
        
        this.getParent = function(){
            return m_parent;
        }
        
        this.setParent = function(parent){
            m_parent = parent;
        }
  };
};
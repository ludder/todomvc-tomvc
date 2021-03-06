( function() {
    'use strict';

    var todolistController = new ToMvc.Controller( {
        init: function( view, model ) {
            var todolist = document.querySelector( '#todolist' );

            // TODO: move to app
            var actionButton = document.querySelector( '#add-todo button' );
            if ( actionButton ) {
                actionButton.addEventListener( 'click', function() {
                    view.addTodo( view );
                }, false );
            }

            var currentTodos = model.getCurrentTodos();
            view.writeCurrentTodos( currentTodos );
            view.listenTo( 'todo:added', function( data ) {
                view.writeTodo( data );
            } );

            model.listenTo( 'todo:created', function( data ) {
                // var key = window.localStorage.length + 1;
                data.id = model.getNewId();
                window.localStorage.setItem( data.id, JSON.stringify( data ) );
                model.broadcast( 'todo:added', data );
            } );
        }
    } );

    var todolistView = new ToMvc.View( {
        controller: todolistController,
        name: 'todolist',
        el: '#todolist',
        writeCurrentTodos: function( list ) {
            list.forEach( function( item ) {
                todolistView.writeTodo( item );
            } );
        },
        addTodo: function() {
            var text = window.prompt( 'enter event' );
            if ( !text ) {
                return;
            }

            // this.writeTodo( text );

            var data = {
                text: text,
                id: null,
                status: 'active'
            };

            // var todoId = this.controller.getId(); // HIER GEBLEVEN

            // Notify Model of added Todo
            this.broadcast( 'todo:created', data );

            // Immediately ask for another todo to enter
            this.addTodo( this );
        },
        writeTodo: function( data ) {
            var li = document.createElement( 'li' );
            // var input = document.createElement( 'input' );
            li.setAttribute( 'data-todoId', data.id );
            li.textContent = data.text;
            document.querySelector( this.el ).appendChild( li );
        }
    } );

    var todolistModel = new ToMvc.Model( {
        controller: todolistController,
        name: 'todolist',
        getCurrentTodos: function() {
            var list = [],
                data, key;

            for ( var i = 0; i < window.localStorage.length; i++ ) {
                key = window.localStorage.key( i );
                data = window.localStorage.getItem( key );
                list.push( JSON.parse( data ) );
            }
            // TODO re-index keys because of deletions?
            return list;
        },
        // Find highest ID and return (highest ID + 1)
        getNewId: function() {
            var list = [],
                key, item;
            for ( var i = 0; i < window.localStorage.length; i++ ) {
                key = window.localStorage.key( i );
                item = window.localStorage.getItem( key );
                list.push( this.getIdFromLocalstorageDataObject( item ) );
            }
            var max_id = Math.max.apply( Math, list );
            return ( max_id > 0 ) ? ( max_id + 1 ) : 1;
        },
        getIdFromLocalstorageDataObject: function( item ) {
            item = JSON.parse( item );
            return ( typeof item.id === 'number' ) ? item.id : 0;
        }
    } );


    // TODO, create another app, to make sure that they do not interfere

    // GO!
    // console.info( 'todolistController', todolistController );
    todolistController.init( todolistView, todolistModel );

}() );

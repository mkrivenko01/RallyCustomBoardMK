Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',


    launch: function() {
        this._loadData();
    },

    _loadData: function() {
        var myStore = Ext.create('Rally.data.wsapi.Store', {
            model: 'User Story',
            autoLoad: true,
            listeners: {
                load: function(myStore, myData, success) {
                    console.log ('got data!', myStore, myData, success);
                    this._loadGrid(myStore);
                },
                scope: this
            },
            fetch: ['FormattedID', 'Name', 'ScheduleState']
        });
    },

    _loadGrid: function(aStore) {
        var myGrid = Ext.create('Rally.ui.grid.Grid', {
            store: aStore, columnCfgs: [
                'FormattedID', 'Name', 'ScheduleState']
        });

        console.log ('myGrid: ', myGrid);
        this.add(myGrid);
    }

        //API Docs: https://help.rallydev.com/apps/2.1/doc/
});

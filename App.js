Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',


    launch: function() {
        this.pulldownContainer = Ext.create('Ext.container.Container', {
            layout: {
                type:'hbox',
                align: 'stretch'
            }
        });

        this.add(this.pulldownContainer);
        this._loadIterations();
    },

    _loadIterations: function () {
        this.iterComboBox = Ext.create('Rally.ui.combobox.IterationComboBox', {
            fieldLabel: 'Iteration',
            labelAlign: 'right',
            width: 400,
            listeners: {
                ready: function(combobox) {
                    //this._loadData();
                    this._loadSeverities();
                },
                select: function(combobox, records) {
                    this._loadData();
                },
                scope: this
            }
        });
        this.pulldownContainer.add(this.iterComboBox);
    },

    _loadSeverities: function () {
        this.severityComboBox = Ext.create('Rally.ui.combobox.FieldValueComboBox', {
            model: 'Defect',
            field: 'Severity',
            fieldLabel: 'Severity',
            labelAlign: 'right',
            listeners: {
                ready: function(combobox) {
                    this._loadData();
                },
                select: function(combobox, records) {
                    this._loadData();
                },
                scope: this
            }

        });

        this.pulldownContainer.add(this.severityComboBox);
    },
    _loadData: function(iterRef) {

        var selectedIteration = this.iterComboBox.getRecord().get('_ref');
        var selectedSeverity = this.severityComboBox.getRecord().get('value');

        console.log (selectedIteration);
        console.log (selectedSeverity);

        var myFilters = [
                            {
                                property: 'Iteration',
                                operation: '=',
                                value: selectedIteration
                            },
                            {
                                property: 'Severity',
                                operation: '=',
                                value: selectedSeverity
                            }
                        ];

        console.log(myFilters);

        if (this.defectStore) {
            console.log ('updating filters');
            this.defectStore.setFilter(myFilters);
            this.defectStore.load();
        } else {
            this.defectStore = Ext.create('Rally.data.wsapi.Store', {
                model: 'Defect',
                autoLoad: true,
                filters: myFilters,
                listeners: {
                    load: function(defectStore, myData, success) {
                        if (!this.myGrid) {
                            console.log('creating grid');
                            this._createGrid(defectStore);
                        }

                    },
                    scope: this
                },
                fetch: ['FormattedID', 'Name', 'ScheduleState', 'Severity','Iteration']
            });
        }
    },

    _createGrid: function(aStore) {
        this.myGrid = Ext.create('Rally.ui.grid.Grid', {
            store: aStore, columnCfgs: [
                'FormattedID', 'Name', 'ScheduleState']
        });

        //console.log ('myGrid: ', myGrid);
        this.add(this.myGrid);
    }

        //API Docs: https://help.rallydev.com/apps/2.1/doc/
});

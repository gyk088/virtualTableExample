# Table with virtual scroll and infinite scroll
## Overview

#### This table has advanced functionality
#### Written in pure javascript
#### Easy integration into various frameworks (React, Vue, Angular)
#### Easy integration into Salesforce



## Features:
* virtual scroll
* infinite scroll
* filters
* sorting
* row selection
* multi select
* loader

## Usage
### Create table:

```javaScript
    const vtable = new vTable(config);
```

### Config:

```javaScript
    const config = {
        node: domElement
        numberOfVisibleRows: 10,
        rowHeight: 32,
        header: header,
        multiSelect: true,
        noDataText: 'text string or html string',
        footer: {
            height: 32,
            content: 'text string or html string'
        },
        loading: 'text string or html string',
        onRowClick: function(row, RowIndex) {},
        onRowDblClick: function(row, RowIndex) {},
        next: function(lastRow) {}
        data: []
    }
```
###### Config parameters:
* `config.node` - optional, type **HTMLElement**, html dom element **const el = document.getElementById("TEST");**.
* `config.numberOfVisibleRows` - required, type **Integer**, number of visible rows.
* `config.rowHeight` - required, type **Integer**, height of row.
* `config.header` - required, type **Object**, complex type. See below.
* `config.multiSelect` - optional, type **Boolean**, if true - you can select many rows. By default **false**.
* `config.noDataText` - optional, type **String**, you cant paste string **'your text'** or html string **<div style="color:red"> your text </div>**. When table is empty, this text will appear. By default **There is no data**.
* `config.loading` - optional, type **String**, you cant paste string **'your text'** or html string **<div style="color:red"> your text </div>**. When you call the method **vtable.loadingStart()**, this text will appear. By default **Loading...**.
* `config.footer` - optional, type **Object**, footer definition.
* `config.footer.height` - optional, type **Integer**, footer height.
* `config.footer.content` - optional, type **String**, footer content. You cant paste string **'your text'** or html string **<div style="color:red"> your text </div>**.
* `config.onRowClick` - optional, type **Function**, row click event. `row` - selected row object, `RowIndex` - selected row index.
* `config.onRowDblClick` - optional, type **Function**, row double click event. `row` - selected row object, `RowIndex` - selected row index.
* `config.next` - optional, type **Function**, scroll end event. If you want to implement infinite scroll you need to use this event. `lastRow` - last row object.
* `data` - optional, type **Array**, data for table.

###### Config Header `config.header`:

```javaScript
    const header = [
    {
        key: 'KeyFromData',
        title: '№',
        width: '7%',
        filter: true,
        sort: true,
        template: (row, index) => {
            if (row.number % 2 !== 0) {
                return `<div style="color: red">${row._vTableId}<div>`
            } else {
                return row._vTableId;
            }
        }
    },
    ......
    {
        key: 'ClassName__c',
        title: 'ClassName',
        width: '20%',
        filter: true,
    },
    {
        key: 'requestTime',
        title: 'Time',
        width: '15%',
        sort: true,
        filter: true,
    },
];
```
###### Config Header parameters:
* `key` - required, type **String**. The key from your data that you want to display.
* `title` - optional, type **String**. Table header cell content. You cant paste string **'your text'** or html string **<div style="color:red"> your text </div>**.
* `width` - optional, type **String**. Table column width. Yuo can use **px** or **%**.
* `sort` - optional, type **Boolean**. Sorting option.  By default **false**.
* `filter` - optional, type **Boolean**. Filter option.  By default **false**.
* `template` - optional, type **Function**. Cell template. See below.

### Table Api

```javaScript
    const vtable = new vTable(config);

    const el = document.getElementById("TEST");
    const data = [{test1: 1, test2: 2 ....}, ....];

    vtable.init(el, data);

    const rowCount = vtable.getRowCount();

    vtable.setData(data);
    vtable.addData(data);

    const arrOfTableData = vtable.selectAll();
    vtable.removeSelection();

    vtable.loadingStart();
    vtable.loadingStop();

    vtable.setFooterContent('row count: ' + vtable.getRowCount());

    vtable.reRender();

    vtable.destroy();
```
* `vtable.init(el, data)` - if you didn't define `config.node` you can use this method to initialize table.
* `vtable.getRowCount()` - return number of visible rows.
* `vtable.setData(data)` - set data to the table.
* `vtable.addData(data)` - add data to the table.
* `vtable.selectAll()` - select all visible data in the table and return selected data.
* `vtable.removeSelection()` - remove all selection in the table.
* `vtable.loadingStart()` - show the loader.
* `vtable.loadingStop()` - hide the loader.
* `vtable.setFooterContent('String')` - set footer content.  You cant set string **'your text'** or html string **<div style="color:red"> your text </div>**.
* `vtable.reRender()` - re-render the table.
* `vtable.destroy()`  - destroy the table.



## Salesforce
This table is very easy to use in LWC.<br>
If you want to use thi table in LWC you need:
* Copy `table.js` and past it into your LWC component
* Copy  all styles from `tableSalesforce.css` and past them into the LWC style component file

```javaScript
import { LightningElement } from 'lwc';
import vTable from './table';

export default class MyComponent extends LightningElement {

    renderedCallback() {
        this.tableElement = this.template.querySelector('.tableElement');
        if (this.tableElement && !this.vtable) {
            this.vtable = new vTable(config);
        }
    }

}
```

![Example](https://gyk088.github.io/virtualTableExample/example.png)







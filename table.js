function vTable(config) {
    this.config = config;
    this.shift = 0;
    this.scrollTop = 0;
    this.filters = {};

    if (this.config.node && this.config.data) {
      this.init()
    }
  }

  vTable.prototype.init = function(node, data) {
    this.config.node = this.config.node || node;

    if (!this.config.node) {
      console.error('vTable: undefined parent DOM element')
      return;
    }

    if (Array.isArray(data)) {
      this.config.data = data
      this.config.fullData = data
    } else {
      console.error('Data mast be an array');
      return;
    }

    this._initScroll();
    this._createWrapper();
    this._createTable();
    this._createHeaderWrapper();
    this._createHeader();
    this._createHeaderRow();
    this._createHeaderRowCell();
    this._createHeaderRowFilterCell();
    this._createBody();
    this._createBodyRow();

    this._bind();

    this.config.node.appendChild(this.wrapper);
  }

  vTable.prototype._initScroll = function() {
    this.fullHeight = this.config.data.length * parseInt(this.config.rowHeight);
    const tableHeight = parseInt(this.config.rowHeight) * this.config.numberOfVisibleRows;
    const scroller = document.createElement("div");
    scroller.style.opacity = 0;
    scroller.style.position = "absolute";
    scroller.style.top = 0;
    scroller.style.left = 0;
    scroller.style.width = "1px";
    scroller.style.height = this.fullHeight + 'px';
    this.tableWrapper = document.createElement("div");
    this.tableWrapper.classList.add('myVTable_body_wrapper');
    this.tableWrapper.style.position = "relative";
    this.tableWrapper.style.overflowY = 'auto';
    this.tableWrapper.style.height = this.config.height || tableHeight + 'px';
    this.tableWrapper.appendChild(scroller);
    this.tableWrapper.addEventListener('scroll', this._onscroll.bind(this))
  }

  vTable.prototype.reload = function(data) {
    this.destroy();
    this.init(null, data);
  }

  vTable.prototype.destroy = function() {
    if (this.config.node) {
      this.config.node.innerHTML = '';
    }
  }

  vTable.prototype.addDefaultStyle = function () {
    this._addTableStyle();
    this._addHeaderRowStyle();
    this._addHeaderCellDivArrStyle();
    this._addBodyCellDivArrStyle();
    this._addBodyRowArrStyle()
  }

  vTable.prototype._addTableStyle = function () {
    this.table.style.background = 'rgb(255, 255, 255)';
    this.table.style.border = 'solid 1px rgb(221, 219, 218)';
  }

  vTable.prototype._addHeaderRowStyle = function () {
    // this.headerRow.style.background = 'rgb(255, 255, 255)';
    // this.headerRowFilter.style.background = 'rgb(255, 255, 255)';
  }

  vTable.prototype._addHeaderCellDivArrStyle = function () {
    this.headerCellDivArr.forEach(div => {
      div.style.borderBottom = 'solid 1px rgb(221, 219, 218)';
      div.style.borderLeft = 'solid 1px rgb(221, 219, 218)';
      div.style.borderRight = 'solid 1px rgb(221, 219, 218)';
      div.style.zIndex = '10';
      div.style.textAlign = 'center';
      div.style.fontWeignt = '600';
      div.style.color = 'rgb(81, 79, 77)';
      div.style.padding = '8px';
    });

    this.headerCellDivFilterArr.forEach(div => {
      div.style.borderBottom = 'solid 1px rgb(221, 219, 218)';
      div.style.borderLeft = 'solid 1px rgb(221, 219, 218)';
      div.style.borderRight = 'solid 1px rgb(221, 219, 218)';
      div.style.zIndex = '10';
      div.style.textAlign = 'center';
      div.style.fontWeignt = '600';
      div.style.color = 'rgb(81, 79, 77)';
      div.style.padding = '8px';
    });
  }

  vTable.prototype._addBodyCellDivArrStyle = function () {
    this.bodyCellDivArr.forEach(div => {
      div.style.textAlign = 'center';
      div.style.fontWeignt = '400';
      div.style.color = 'rgb(81, 79, 77)';
      div.style.padding = '8px';
    });
  }

  vTable.prototype._addBodyRowArrStyle = function () {
    this.bodyRowArr.forEach(row => {
      row.style.borderBottom = 'solid 1px rgb(221, 219, 218)';
    });
  }

  vTable.prototype._addBodyRowStyle = function (row) {
    row.style.borderBottom = 'solid 1px rgb(221, 219, 218)';
  }

  vTable.prototype._addBodyCellDivStyle = function (div) {
    div.style.textAlign = 'center';
    div.style.fontWeignt = '400';
    div.style.color = 'rgb(81, 79, 77)';
    div.style.padding = '8px';
  }

  vTable.prototype._onscroll = function(e) {

    const scrollTop = e.target.scrollTop;
    const rowHeight = parseInt(this.config.rowHeight);

    const fIndex = parseInt(scrollTop / rowHeight);
    var lIndex = fIndex + this.config.numberOfVisibleRows;

    if (lIndex > this.config.data.length) {
      lIndex = this.config.data.length;
    } else {
      this.stopScrolling = false;
    }

    if (this.stopScrolling) return;
    this.tbody.innerHTML = '';
    const fragment = document.createDocumentFragment();
    for (let i = fIndex; i < lIndex; i++) {
      const row = this._createRow(i);
      if (row) fragment.appendChild(row);
    }

    this.tbody.appendChild(fragment);

    this.table.style.top = scrollTop;

    if (lIndex === this.config.data.length) {
      this.stopScrolling = true;
    }

    e.preventDefault && e.preventDefault();
  }

  vTable.prototype._bind = function() {
    this.headerCellArr.forEach(cell => {
      this.headerRow.appendChild(cell);
    });

    this.tbody.appendChild(this.fragment);
    this.header.appendChild(this.headerRow);
    this.header.appendChild(this.headerRowFilter);
    this.table.appendChild(this.tbody);
    this.tableWrapper.appendChild(this.table);
    this.headerWrapper.appendChild(this.header);
    this.wrapper.appendChild(this.headerWrapper);
    this.wrapper.appendChild(this.tableWrapper);
  }

  vTable.prototype._createWrapper = function() {
    this.wrapper = document.createElement("div");
    this.wrapper.style.overflow = 'auto';
    this.wrapper.classList.add('myVTable_wrapper');
  }

  vTable.prototype._createHeaderWrapper = function() {
    this.headerWrapper = document.createElement("div");
    this.headerWrapper.classList.add('myVTable_header_wrapper');
  }

  vTable.prototype._createTable = function() {
    this.table = document.createElement("table");
    this.table.classList.add('myVTable_table');
    this.table.style.width = '100%';
    this.table.style.position = 'absolute';
  }

  vTable.prototype._createHeader = function() {
    this.header = document.createElement("table");
    this.header.classList.add('myVTable_header');
    this.header.style.width = '100%';
  }

  vTable.prototype._createHeaderRow = function() {
    this.headerRow = document.createElement("tr");
    this.headerRow.classList.add('myVTable_header_row');
  }

  vTable.prototype._createHeaderRowCell = function() {
    this.headerCellArr = [];
    this.headerCellDivArr = [];
    if (Array.isArray(this.config.header)) {
      this.config.header.forEach(d => {
          const cell = document.createElement("th");
          cell.classList.add('myVTable_header_row_cell');

          if (d.width) {
            cell.style.width = d.width
          }

          const div = document.createElement("div");
          div.classList.add('myVTable_header_row_cell_div');
          div.innerText = d.title;

          cell.appendChild(div);

          this.headerCellArr.push(cell);
          this.headerCellDivArr.push(div);
      })
    }
  }

  vTable.prototype._createHeaderRowFilterCell = function() {
    this.headerRowFilter = document.createElement("tr");
    this.headerRowFilter.classList.add('myVTable_header_row_filter');
    this.headerCellFilterArr = [];
    this.headerCellDivFilterArr = [];
    var hasFilter = false;
    this.config.header.forEach(d => {
      if (d.filter) hasFilter = true;
    })

    if (!hasFilter) return;

    this.config.header.forEach(d => {
        const cell = document.createElement("th");
        cell.classList.add('myVTable_header_row_cell_filter');

        if (d.width) {
          cell.style.width = d.width
        }

        if (d.filter) {
          const div = document.createElement("div");
          div.classList.add('myVTable_header_row_cell_div_filter');
          const input = this._createHeaderRowInput(d);
          div.appendChild(input);
          cell.appendChild(div);
          this.headerCellDivFilterArr.push(div);
        }

        this.headerCellFilterArr.push(cell);
        this.headerRowFilter.appendChild(cell);
    })
  }

  vTable.prototype._createHeaderRowInput = function(headerElement) {
    const input = document.createElement("input");
    input.type = "text";
    input.className = "myVTable_header_row_cell_input_filter";
    input.style.width = '80%';
    const $this = this;
    input.addEventListener('keyup', function(e) {
      $this._filter(e.target.value, headerElement.key)
    });

    return input;
  }

  vTable.prototype._filter = function(searchStr, key) {
    this.filters[key] = searchStr;
    searchStr = searchStr.toString().toUpperCase();
    const visibleData = [];
    this.config.fullData.forEach(d => {
        var add = true;
        for (const filterKey in this.filters) {
          const cellVal = d[filterKey].toString().toUpperCase();
          if (!cellVal.includes(this.filters[filterKey])) {
            add = false;
          }
        }

        if (add) {
          visibleData.push(d)
        }
    })

    this._renderFilteredData(visibleData);
  }

  vTable.prototype._renderFilteredData = function (visibleData) {
    this.config.data = visibleData;
    this.tableWrapper.remove()
    this._initScroll();
    this._createBody();
    this._createBodyRow();
    this._createBody();
    this._createTable();

    this.tbody.appendChild(this.fragment);
    this.table.appendChild(this.tbody);
    this.tableWrapper.appendChild(this.table);
    this.wrapper.appendChild(this.tableWrapper);
    this.addDefaultStyle();
  }

  vTable.prototype._createBody = function() {
    this.tbody = document.createElement("tbody");
    this.tbody.classList.add('myVTable_body');
  }

  vTable.prototype._createBodyRow = function() {
    this.bodyRowArr = [];
    this.bodyCellArr = [];
    this.bodyCellDivArr = [];
    this.fragment = document.createDocumentFragment();

    if (Array.isArray(this.config.data)) {
      for (let i = 0; i < this.config.numberOfVisibleRows; i++ ) {
        const row = this._createRow(i);
        this.fragment.appendChild(row);
        if (row) this.bodyRowArr.push(row);
      }
    }
  }

  vTable.prototype._createRow = function(index) {
    if (!this.config.data[index]) return;

    const row = document.createElement("tr");
    row.classList.add('myVTable_body_row');
    row.style.height = this.config.rowHeight;

    if (Array.isArray(this.config.header)) {
      this.config.header.forEach(hd => {
        const cell = document.createElement("th");
        const div = document.createElement("div");

        if (hd.width) {
          cell.style.width = hd.width;
        }

        cell.classList.add('myVTable_body_cell');
        div.classList.add('myVTable_body_cell_div');
        const template = hd.template ? hd.template(this.config.data[index], index) : this.config.data[index][hd.key];
        div.innerHTML = template;

        this._addBodyCellDivStyle(div);

        cell.appendChild(div);
        row.appendChild(cell);


        this.bodyCellArr.push(cell);
        this.bodyCellDivArr.push(div);
      })
    }

    this._addBodyRowStyle(row);
    return row;
  }

  // export default vTable;
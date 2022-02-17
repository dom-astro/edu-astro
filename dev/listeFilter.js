class ListeFilter {
	init(params) {
		this.valueGetter = params.valueGetter;
		this.filterText = null;
		this.setupGui(params);
		this.params=params;
		this.selectedItems=[];
	}

	// not called by AG Grid, just for us to help setup
	setupGui(params) {
		this.colId = params.column.colId;
		this.dimList = [];
		params.api.forEachNode(node => {
			var dim = {};
			//dim.elemNumber=node.data[this.colId].elemNumber;
			dim.text=node.data[this.colId];
			this.dimList.push(dim);
		});

		this.dimList = this.dimList.filter((dim, i, self) => 
			self.map(item => item.text).indexOf(dim.text) === i
		);

		this.dimList.sort(this.sortByText);

		this.gui = document.createElement('div');
		this.gui.style.height="65px";
		this.gui.innerHTML = this.getHtmlCode(this.dimList);

		const listenerSelect = (event) => {
			var selectedItems=[];
			var self=this;
			var options=event.currentTarget
			for (let i=0; i<options.length; i++) {
				if (options[i].selected) {
						selectedItems.push(options[i].text); 
				}
			}
			/* options.forEach(function(option) {
				if (option.selected) {
						selectedItems.push(option.text); 
				}
			}); */

			if(this.selectedItems.length==1 && selectedItems.length==1 && this.selectedItems[0]==selectedItems[0]) {
				this.selectedItems = [];
				for (let i=0; i<options.length; i++) {
						options[i].selected=false;
				}
			} else {
				this.selectedItems = selectedItems;
			}
			params.filterChangedCallback();
		};

		const listenerFilter = (event) => {
			var filtertText = event.target.value;

			if (this.eDimSelect !== undefined && filtertText !== "") {
				var options = [];
				// On vide la liste
				for (var i=this.eDimSelect.options.length-1; i>=0; i--) {
					this.eDimSelect.options.remove(i);
				}

				// On refait la liste filtrÃ©e
				var self=this;
				this.dimList.forEach(function(dim) {
					if(dim.text.toLowerCase().indexOf(filtertText.toLowerCase())>=0) {
						var option=document.createElement('option');
						option.value=dim.text;
						option.text=dim.text;
						self.eDimSelect.options.add(option,self.eDimSelect.options[self.eDimSelect.options.length-1]);
					}
				});
			}
			if (this.eDimSelect !== undefined && filtertText == "") {
				var options = [];
				// On vide la liste
				for (var i=this.eDimSelect.options.length-1; i>=0; i--) {
					this.eDimSelect.options.remove(i);
				}

				// On refait la liste filtrÃ©e
				var self=this;
				this.dimList.forEach(function(dim) {
					var option=document.createElement('option');
					option.value=dim.text;
					option.text=dim.text;
					self.eDimSelect.options.add(option,self.eDimSelect.options[self.eDimSelect.options.length-1]);
				});
			};
		}

		this.eDimSelect = this.gui.querySelector('#dimListe');
		this.eDimSelect.addEventListener('click', listenerSelect);

		this.eDimFilter = this.gui.querySelector('#dimFilter');
		this.eDimFilter.addEventListener('changed', listenerFilter);
		this.eDimFilter.addEventListener('paste', listenerFilter);
		this.eDimFilter.addEventListener('input', listenerFilter);
/*		this.eDimFilter.addEventListener('keydown', listenerFilter);
		this.eDimFilter.addEventListener('keyup', listenerFilter);*/
	}

	getGui() {
	  return this.gui;
	}

	doesFilterPass(params) {
		let passed = false;
		const value = params.data[this.colId];

		this.selectedItems.forEach(function(item) {
			if (value.indexOf(item) >= 0) {
				passed = true;
			}
		});

	  return passed;
	}

	isFilterActive() {
	  return this.selectedItems != null && this.selectedItems.length != 0;
	}

	getModel() {
		return { value: this.selectedItems.value };
	  }

	setModel(model) {
		this.selectedItems = model;
	}  

	getHtmlCode(dimList) {
		var html  = '<div class="ag-wrapper ag-input-wrapper ag-text-field-input-wrapper" style="margin: 10px">';
			html += '  <input id="dimFilter" class="ag-input-field-input ag-text-field-input" placeholder="Filter..." autofocus>';
			html += '</div>';
			html += '<div class="ag-filter-select ag-labeled ag-label-align-left ag-select" style="margin: 10px">';
			html += '  <select id="dimListe" class="ag-theme-alpine ag-select ag-picker-field-wrapper">';
			dimList.forEach(function(dim) {
				html += '    <option value="'+dim.text+'">'+dim.text+'</option>';
			});
			html += '  </select>';
			html += '</div>';

		return html;
	}

	sortByText(key1, key2) {
		return key1.text.localeCompare(key2.text);
	}
}
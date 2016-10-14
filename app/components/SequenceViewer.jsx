var React = require('react');
var ReactDOM = require('react-dom');
var SequenceThumbnailStripCanvas = require('SequenceThumbnailStripCanvas');
var SourceManifestMetadataDialog = require('SourceManifestMetadataDialog');

var SequenceViewer = React.createClass({
  getInitialState: function() {
    return {
      selectedCanvasStartIndex: undefined,
      selectedCanvasEndIndex: undefined
    }
  },
  setCanvasStartIndex: function(startCanvasIndex) {
    // set the start index for the range of selected canvases
    this.setState({
      selectedCanvasStartIndex: startCanvasIndex,
      selectedCanvasEndIndex: undefined
    });
  },
  setCanvasEndIndex: function(endCanvasIndex) {
    // set the start and end indexes for the range of selected canvases
    var selectedCanvasStartIndex = this.state.selectedCanvasStartIndex;
    var selectedCanvasEndIndex = endCanvasIndex;
    if(this.state.selectedCanvasStartIndex > endCanvasIndex) {
      selectedCanvasStartIndex = endCanvasIndex;
      selectedCanvasEndIndex = this.state.selectedCanvasStartIndex;
    }
    this.setState({
      selectedCanvasStartIndex: selectedCanvasStartIndex,
      selectedCanvasEndIndex: selectedCanvasEndIndex
    });
  },
  isCanvasSelected: function(currentCanvasIndex) {
    // return whether the canvas is selected if its index falls within the selected start and end range
    if(this.state.selectedCanvasStartIndex !== undefined && this.state.selectedCanvasEndIndex !== undefined) {
      return currentCanvasIndex >= this.state.selectedCanvasStartIndex && currentCanvasIndex <= this.state.selectedCanvasEndIndex;
    }
    // select the current canvas if an incomplete range is specified
    else {
      return currentCanvasIndex == this.state.selectedCanvasStartIndex || currentCanvasIndex == this.state.selectedCanvasEndIndex;
    }
  },
  setCanvasData: function(e) {
    var rawCanvasData = [];
    var canvases = this.props.sequence.getCanvases();
    if(this.state.selectedCanvasStartIndex !== undefined && this.state.selectedCanvasEndIndex !== undefined) {
      for(var canvasIndex = this.state.selectedCanvasStartIndex; canvasIndex <= this.state.selectedCanvasEndIndex; canvasIndex++) {
        var canvas = canvases[canvasIndex];
        rawCanvasData.push(canvas.__jsonld);
      }
    } else {
      var canvas = canvases[this.state.selectedCanvasStartIndex];
      rawCanvasData.push(canvas.__jsonld);
    }
    e.dataTransfer.setData("text/plain", JSON.stringify(rawCanvasData));
  },
  showSourceManifestMetadataDialog: function() {
    var $sourceManifestMetadataDialog = $(ReactDOM.findDOMNode(this.refs.sourceManifestMetadataDialog));
    $sourceManifestMetadataDialog.modal({
      backdrop: 'static'
    });
  },
  render: function() {
    var _this = this;
    return (
      <div className="sequence-viewer" onDragStart={this.setCanvasData}>
        <SourceManifestMetadataDialog ref="sourceManifestMetadataDialog" manifestData={this.props.manifestData} />
        <a onClick={() => this.showSourceManifestMetadataDialog()} className="btn btn-default sequence-viewer-info-icon-button" title="Show manifest metadata"><i className="fa fa-info"></i></a>
        <a onClick={() => this.props.onRemoveHandler(this.props.sequenceIndex)} className="btn btn-default remove-sequence-button" title="Remove sequence"><i className="fa fa-times-circle"></i></a>
        {
          this.props.sequence.getCanvases().map(function(canvas, canvasIndex) {
            return (
              <SequenceThumbnailStripCanvas key={canvasIndex} canvas={canvas} canvasIndex={canvasIndex} isSelectedCanvas={_this.isCanvasSelected(canvasIndex)} onCanvasNormalClick={_this.setCanvasStartIndex} onCanvasShiftClick={_this.setCanvasEndIndex}/>
            );
          })
        }
      </div>
    );
  }
});

module.exports = SequenceViewer;
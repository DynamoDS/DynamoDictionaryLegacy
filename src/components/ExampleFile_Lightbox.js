import React, { Component } from 'react';
import Lightbox from 'react-image-lightbox';

class ExampleFile_Lightbox extends Component {
  constructor(props) {
        super(props);
        this.state = {
            photoIndex:0,
            isOpen: true
        };
        this.closeLightbox = this.closeLightbox.bind(this);
    }
    componentDidMount(props){
      this.setState({photoIndex:this.props.index})
    }
    closeLightbox(){
      this.setState({ isOpen: false })
      this.props.closeHandle();
    }
    render(){
      const images = this.props.imgPaths;
      const {
          photoIndex,
            isOpen
        } = this.state;

          return (
              <div>
                    {isOpen ?
                        <Lightbox
                            mainSrc={images[photoIndex]}

                              nextSrc={images.length>1?images[(photoIndex + 1) % images.length]:null}
                              prevSrc={images.length>1?images[(photoIndex + images.length - 1) % images.length]:null}



                            onCloseRequest={this.closeLightbox}
                            onMovePrevRequest={() => this.setState({
                                photoIndex: (photoIndex + images.length - 1) % images.length,
                            })}
                            onMoveNextRequest={() => this.setState({
                                photoIndex: (photoIndex + 1) % images.length,
                            })}
                        />
                      :
                        null}
                        </div>
        )
    }
}

export default ExampleFile_Lightbox;

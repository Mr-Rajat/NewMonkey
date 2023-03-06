import React, { Component } from 'react'
import NewItem from './NewItem'
import Spinner, { spinner } from './Spinner'
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";


export class News extends Component {

  static defaultProps = {
    country: 'in',
    pageSize: 8,
    category: 'general'

  }

  static propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string
  }

   captilizeFirstLetter = (string) =>{
    return string.charAt(0).toUpperCase()+ string.slice(1);
  }

  constructor(props) {
    super(props);
    // console.log("Hello i am a constructor from news component");
    this.state = {
      articles: [],
      loading: false,
      page: 1,
      totalResults: 0
    }
    document.title = `${this.captilizeFirstLetter(this.props.category)} - NewsMonkey`;
  }

  async updateNews() {
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=0d3440755ae14a58804e1d1f0219bec3&page=${this.state.page}&pageSize=${this.props.pageSize}`;

    this.setState({ loading: true });
    let data = await fetch(url);
    let parseData = await data.json()
    // console.log(parseData);
    this.setState({
      articles: parseData.articles,
      totalResults: parseData.totalResults,
      loading: false
    })
  }


  async componentDidMount() {

    this.updateNews();

    // let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=0d3440755ae14a58804e1d1f0219bec3&page=1&pageSize=${this.props.pageSize}`;

    // this.setState({loading: true});
    // let data = await fetch(url);
    // let parseData = await data.json()
    // console.log(parseData);
    // this.setState({articles : parseData.articles,
    //    totalResults : parseData.totalResults,
    //    loading : false})
  }



  handlePrevClick = async () => {
    // console.log("Previous");

    // let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=0d3440755ae14a58804e1d1f0219bec3&page=${this.state.page - 1}&pageSize=${this.props.pageSize}`;

    // this.setState({loading: true});
    // let data = await fetch(url);
    // let parseData = await data.json()
    // console.log(parseData);

    // this.setState({
    //   page: this.state.page - 1,
    //   articles : parseData.articles,
    //   loading : false

    // })

    this.setState({ page: this.state.page - 1 })
    this.updateNews();
  }

  handleNextClick = async () => {
    this.setState({ page: this.state.page + 1 })
    this.updateNews();
  }

  fetchMoreData = async () => {
    this.setState({page: this.state.page + 1})
    
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=0d3440755ae14a58804e1d1f0219bec3&page=${this.state.page}&pageSize=${this.props.pageSize}`;

    this.setState({ loading: true });
    let data = await fetch(url);
    let parseData = await data.json()
    console.log(parseData);
    this.setState({
      articles: this.state.articles.concat(parseData.articles),
      totalResults: parseData.totalResults,
      loading: false
    })
  }

  render() {
    // console.log("render");
    return (
      <>
       {/* <div className="container my-3"> */}
        <h1 className='text-center'>NewsMonkey - Top {this.captilizeFirstLetter(this.props.category)} Headlines</h1>
        {this.state.loading && <Spinner />}

        <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={this.state.articles.length !== this.state.totalResults}
          loader={this.state.loading &&<Spinner/>}
        >

        
        <div className="container">

        
        <div className="row my-3">
          {/* {!this.state.loading && this.state.articles.map((element) => { */}
          {this.state.articles.map((element) => {
            return <div className="col-md-4" key={element.url}>
              <NewItem title={element.title ? element.title : ""} description={element.description ? element.description : ""} imageUrl={element.urlToImage ? element.urlToImage : 'https://images.hdqwalls.com/download/kimetsu-no-yaiba-anime-4k-yn-1360x768.jpg'} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name} />
            </div>
          })}

        </div>
        </div>

        </InfiniteScroll>
        </>

        // {/* <div className="containe d-flex justify-content-between">
        //   <button disabled={this.state.page <= 1} type="button" className="btn btn-dark" onClick={this.handlePrevClick}>&larr; Previous</button>
        //   <button disabled={this.state.page + 1 > Math.ceil(this.state.totalResults / this.props.pageSize)} type="button" className="btn btn-dark" onClick={this.handleNextClick}>Next &rarr;</button>
        // </div> */}
      // {/* </div> */}
    )
  }
}

export default News
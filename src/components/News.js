import React, { useEffect, useState } from 'react'
import NewItem from './NewItem'
import Spinner from './Spinner'
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";


const News = (props) => {

  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true) //change to false if not work
  const [page, setPage] = useState(1)
  const [totalResults, settotalResults] = useState(0)

  const captilizeFirstLetter = (string) =>{
    return string.charAt(0).toUpperCase()+ string.slice(1);
  }

  const  updateNews = async () => {

    props.setProgress(10);
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
    setLoading(true)
    let data = await fetch(url);
    props.setProgress(30);
    let parseData = await data.json()
    props.setProgress(70);
    // console.log(parseData);
    
    setArticles(parseData.articles)
    settotalResults(parseData.totalResults)
    setLoading(false)

    props.setProgress(100);
  }

  useEffect(() => {
    document.title = `${captilizeFirstLetter(props.category)} - NewsMonkey`;
    updateNews();
    // eslint-disable-next-line
  
  }, [])

  const fetchMoreData = async () => {
    
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page+1}&pageSize=${props.pageSize}`;
    
    setPage(page+1)
    // setLoading(true) // uncomment if not works
    let data = await fetch(url);
    let parseData = await data.json()
    // console.log(parseData);

    setArticles(articles.concat(parseData.articles))
    settotalResults(parseData.totalResults)
  }
    // console.log("render");
    return (
      <>
       {/* <div className="container my-3"> */}
        <h1 className='text-center' style={{margin: '35px 0', marginTop:'90px'}}>NewsMonkey - Top {captilizeFirstLetter(props.category)} Headlines</h1>
        {loading && <Spinner />}

        <InfiniteScroll
          dataLength={articles.length}
          next={fetchMoreData}
          hasMore={articles.length !== totalResults}
          loader={loading &&<Spinner/>}
        >

        
        <div className="container">

        
        <div className="row my-3">
          {/* {!loading && articles.map((element) => { */}
          {articles.map((element) => {
            return <div className="col-md-4" key={element.url}>
              <NewItem title={element.title ? element.title : ""} description={element.description ? element.description : ""} imageUrl={element.urlToImage ? element.urlToImage : 'https://images.hdqwalls.com/download/kimetsu-no-yaiba-anime-4k-yn-1360x768.jpg'} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name} />
            </div>
          })}

        </div>
        </div>

        </InfiniteScroll>
        </>
    )
  
}

News.defaultProps = {
  country: 'in',
  pageSize: 8,
  category: 'general'

}

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string
}

export default News
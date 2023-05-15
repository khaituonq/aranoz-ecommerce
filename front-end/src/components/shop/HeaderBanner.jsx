import axios from 'axios';
import { useEffect, useReducer } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Navigation, Pagination } from 'swiper';
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return {...state, loading: true}
    case 'FETCH_SUCCESS': 
      return {...state, loading: false, banners: action.payload}
    case 'FETCH_FAIL':
      return {...state, loading: false, error: action.payload}  
    default:
      break;
  }
}

const HeaderBanner = () => {
  const [{error, banners}, dispatch] = useReducer(reducer, {error: '', loading: true, data: []})

  useEffect(() => {
    const fetchData = async() => {
      dispatch({type: 'FETCH_REQUEST'})
      try {
        const result = await axios.get(`/api/product/banners`)
        dispatch({type: 'FETCH_SUCCESS', payload: result.data})
      } catch (error) {
        dispatch({type: 'FETCH_FAIL', payload: error.message})
      }
    }
    fetchData()
  },[])
  

  return (
    error ? null :  
    <section className='header-banner'>
      <Container>
        <Swiper
          navigation={{
            nextEl: ".btn.next",
            prevEl: ".btn.prev"
          }}
          pagination={{
            type: "custom",
            el: ".current-slide",
            renderCustom: (swiper, current, total) => {
              return `<span>${current < 10 ? "0" + current : current}</span>`
            }
          }}
          loop={true}
          speed={700}
          modules={[Navigation, Pagination]}
        >
          {banners?.map((banner, index) => (
            <SwiperSlide key={index} style={{height: '500px'}}>
              <Row>
                <Col md={7}>
                  <h2>{banner.name}</h2>
                  <p>{banner.description}</p>
                  <Link to={`/product/${banner.slug}`}>buy now</Link>
                </Col>
                <Col md={5} className="banner-img">
                  <img src={banner.image.secure_url} alt={banner.name} />
                </Col>
              </Row>
            </SwiperSlide>
          ))}
        </Swiper>
      </Container>

      <span className='current-slide'></span>

      <div className='slide-action'>
        <button type="button" className='btn prev'>Previous</button>
        <button type="button" className='btn next'>next</button>
      </div>
    </section>
  )
}

export default HeaderBanner
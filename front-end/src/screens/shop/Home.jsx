import HeaderBanner from '../../components/shop/HeaderBanner'
import Layout from '../../components/shop/Layout'
import ProductList from '../../components/shop/ProductList'
import ProductSale from '../../components/shop/ProductSale'

const Home = () => {
  return (
    <Layout title="Home page">
      <HeaderBanner/>
      <ProductList/>
      <ProductSale/>  
    </Layout>
  )
}

export default Home
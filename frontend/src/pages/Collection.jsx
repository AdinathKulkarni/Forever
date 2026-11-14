import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/frontend_assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';

const Collection = () => {

  const {products, search, showSearch} = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProduct, setFilterProduct] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState('relevant')

  const toggleCategory = (e) => {
      if(category.includes(e.target.value)){
        setCategory( prev => prev.filter(item => item !== e.target.value) )
      } else{
        setCategory(prev => [...prev, e.target.value])
      }
  }

  const toggleSubCategory = (e) => {
    if(subCategory.includes(e.target.value)){
        setSubCategory( prev => prev.filter(item => item !== e.target.value) )
    } else{
        setSubCategory(prev => [...prev, e.target.value])
    }
  }

  function applyFilter(){
    let filterProductCopy = products.slice();

    if(showSearch && search){
      filterProductCopy = filterProductCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
    }

    if(category.length > 0){
      filterProductCopy = filterProductCopy.filter( item => category.includes(item.category));
    }

    if(subCategory.length > 0){
      filterProductCopy = filterProductCopy.filter( item => subCategory.includes(item.subCategory));
    }

    setFilterProduct(filterProductCopy);
  }

  const sortProduct = () => {
    const fpCopy = filterProduct.slice();

    switch(sortType){
      case 'low-high':
        setFilterProduct(fpCopy.sort((a, b) => (a.price - b.price)));
        break;

      case 'high-low':
        setFilterProduct(fpCopy.sort((a, b) => (b.price - a.price)));
        break;

      default:
        applyFilter();
        break;
    }
  }

  useEffect( () => {
    setFilterProduct(products)
  },[] )

  useEffect( () => {
    applyFilter();
  },[category, subCategory, search, showSearch] )

  useEffect( () => {
    sortProduct();
  },[sortType] )

  return (
    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'> 
        {/* Filter  */}
        <div className='min-w-60'>
          <p 
            className='my-2 text-xl flex items-center gap-2'
            onClick={() => setShowFilter(!showFilter)}
            >
              FILTERS
            <img 
              src={assets.dropdown_icon} 
              className={`w-[10px] sm:hidden ${showFilter ? 'rotate-90 transition ease-in-out' : ''}`} 
            />
          </p>
            
            {/* category filter */}
          <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
              <p className='uppercase mb-3 text-sm font-medium'>Categories</p>
              <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
                  <p className='flex gap-2'>
                    <input 
                      className='w-3'
                      type='checkbox'
                      value={'Men'}
                      onChange={toggleCategory}
                    /> Men
                  </p>

                  <p className='flex gap-2'>
                    <input 
                      className='w-3'
                      type='checkbox'
                      value={'Women'}
                      onChange={toggleCategory}
                    /> Women
                  </p>

                  <p className='flex gap-2'>
                    <input 
                      className='w-3'
                      type='checkbox'
                      value={'Kids'}
                      onChange={toggleCategory}
                    /> Kids
                  </p>
              </div>
          </div>

            {/* Subcategory filter  */}
          <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
              <p className='uppercase mb-3 text-sm font-medium'>Type</p>
              <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
                  <p className='flex gap-2'>
                    <input 
                      className='w-3'
                      type='checkbox'
                      value={'Topwear'}
                      onChange={toggleSubCategory}
                    /> Topwear
                  </p>

                  <p className='flex gap-2'>
                    <input 
                      className='w-3'
                      type='checkbox'
                      value={'Bottomwear'}
                      onChange={toggleSubCategory}
                    /> Bottomwear
                  </p>

                  <p className='flex gap-2'>
                    <input 
                      className='w-3'
                      type='checkbox'
                      value={'Winterwear'}
                    onChange={toggleSubCategory}                      
                    /> Winterwear
                  </p>
              </div>
          </div>
        </div>

        <div className='flex-1'>
            <div className='flex justify-between text-base  sm:text-2xl mb-4'>
                <Title text1={'All'} text2={' Collections'} />

                {/* sort product  */}
                <select 
                className='border-2 border-gray-300 text-sm px-2'
                onChange={ (e) => setSortType(e.target.value) }
                >
                    <option value={'relevant'}>Relevant</option>
                    <option value={'low-high'}>Low to High</option>
                    <option value={'high-low'}>High to Low</option>
                </select>
            </div>

            {/* map product  */}
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-6 gap-x-3'>
              { 
                filterProduct.map( (items, index) => (
                  <ProductItem 
                  key={index}
                  id={items._id}
                  image={items.image}
                  name={items.name}
                  price={items.price}
                  />
                ) )
              }
            </div>
        </div>

    </div>
  )
}

export default Collection
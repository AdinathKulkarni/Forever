import { useState } from 'react'
import axios from 'axios'
import { assets } from '../assets/admin_assets/assets'
import toast from 'react-hot-toast'
import '../index.css'

const AddItems = ({ token }) => {

  const [loading, setLoading] = useState(false);

  const [productData, setProductData] = useState({
    name: '',
    description: '',
    category: '',
    subCategory: '',
    price: '',
    size: [],
    bestseller: false,
    images: [null, null, null, null]
  })

  const handleChange = (event) => {
    const { name, value } = event.target
    setProductData((current) => ({ ...current, [name]: value }))
  }

  const handleImageChange = (event, index) => {
    const image = event.target.files?.[0] || null
    setProductData((current) => {
      const images = [...current.images]
      images[index] = image
      return { ...current, images }
    })
  }

  const toggleSize = (size) => {
    setProductData((current) => ({
      ...current,
      size: current.size.includes(size)
        ? current.size.filter((item) => item !== size)
        : [...current.size, size]
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!productData.size.length) {
      toast.error('Select at least one product size')
      return
    }

    if (!productData.images.some(Boolean)) {
      toast('Please upload at least 1 product image', {
        icon: '⚠️',
        style: {
          border: '1px solid ',
          padding: '12px 16px',
          color: '#fffff',
          backgroundColor: '#00000',
        },
      });
      return
    }

    const formData = new FormData()
    formData.append('name', productData.name)
    formData.append('description', productData.description)
    formData.append('category', productData.category)
    formData.append('subCategory', productData.subCategory)
    formData.append('price', productData.price)
    formData.append('sizes', JSON.stringify(productData.size))
    formData.append('bestseller', String(productData.bestseller))
    productData.images.forEach((image, index) => {
      if (image) formData.append(`image${index + 1}`, image)
    })

    try {
      setLoading(true);
      const response = await axios.post(
        'http://localhost:4000/api/product/add-product',
        formData,
        { headers: { token } }
      )

      if (!response.data.success) {
        toast.error(response.data.message || 'Failed to add product');
        return
      }

      setProductData({
        name: '', description: '', category: '', subCategory: '', price: '',
        size: [], bestseller: false, images: [null, null, null, null]
      })
      toast.success(response.data.message || 'Product added successfully')
    } catch (error) {
      console.error('Failed to add product:', error)
      toast.error(error.response?.data?.message || 'Failed to add product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className='flex flex-col w-full items-start gap-3 p-5 sm:p-12'>
        <div className=''>
          <p className='mb-2'>Upload Image</p>

          <div className='flex gap-2'>
            <label htmlFor='image1'>
              <img className='w-20 ' src={productData.images[0] ? URL.createObjectURL(productData.images[0]) : assets.upload_area} />
              <input type='file' id='image1' accept='image/*' hidden onChange={(event) => handleImageChange(event, 0)} />
            </label>

            <label htmlFor='image2'>
              <img className='w-20 ' src={productData.images[1] ? URL.createObjectURL(productData.images[1]) : assets.upload_area} />
              <input type='file' id='image2' accept='image/*' hidden onChange={(event) => handleImageChange(event, 1)} />
            </label>

            <label htmlFor='image3'>
              <img className='w-20 ' src={productData.images[2] ? URL.createObjectURL(productData.images[2]) : assets.upload_area} />
              <input type='file' id='image3' accept='image/*' hidden onChange={(event) => handleImageChange(event, 2)} />
            </label>

            <label htmlFor='image4'>
              <img className='w-20 ' src={productData.images[3] ? URL.createObjectURL(productData.images[3]) : assets.upload_area} />
              <input type='file' id='image4' accept='image/*' hidden onChange={(event) => handleImageChange(event, 3)} />
            </label>
          </div>
        </div>

        <div className='w-full '>
          <p>Product name</p>
          <input 
            required
            name='name'
            value={productData.name}
            onChange={handleChange}
            placeholder='Enter product name'
            className='w-full max-w-[500px] px-3 py-2'
          />
        </div>

        <div className='w-full '>
          <p>Product description</p>
          <textarea 
            required
            name='description'
            value={productData.description}
            onChange={handleChange}
            placeholder='Enter product description'
            className='w-full max-w-[500px] px-3 py-2 max-h-[100px]'
          />
        </div>

        <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
          <div>
            <p className='mb-2'>Product Category</p>

            <select name='category' value={productData.category} onChange={handleChange} required className='w-full px-3 py-2'>
              <option value='' disabled>Select category</option>
              <option value='Men'>Men</option>
              <option value='Women'>Women</option>
              <option value='Kids'>Kids</option>
            </select>
          </div>

          <div>
            <p className='mb-2'>Product Subcategory</p>

            <select name='subCategory' value={productData.subCategory} onChange={handleChange} required className='w-full px-3 py-2'>
              <option value='' disabled>Select subcategory</option>
              <option value='Topwear'>Topwear</option>
              <option value='Bottomwear'>Bottomwear</option>
              <option value='Winterwear'>Winterwear</option>
            </select>
          </div>

          <div>
            <p className='mb-2 '>Product Price</p>
            <input name='price' value={productData.price} onChange={handleChange} className='w-full px-3 py-2 sm:w-[120px]' type='number' min='0' placeholder='25' required />
          </div>
        </div>

        <div>
          <p className='mb-2'>Product sizes</p>
          <div className='flex gap-3'>
            {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
              <button
                key={size}
                type='button'
                onClick={() => toggleSize(size)}
                className={`${productData.size.includes(size) ? 'bg-slate-400' : 'bg-slate-200'} px-3 py-1 cursor-pointer`}
                aria-pressed={productData.size.includes(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div className='flex gap-2 mt-2'>
          <input type='checkbox' id='bestseller' checked={productData.bestseller} onChange={(event) => setProductData((current) => ({ ...current, bestseller: event.target.checked }))} />
          <label htmlFor='bestseller'>Bestseller ?</label>
        </div>

        <div className='w-full'>
          <button
            type='submit'
            disabled={loading}
            className='bg-black text-white px-4 py-3 w-full h-12 flex items-center justify-center disabled:cursor-not-allowed'
          >
            {loading
              ? <span className='loader-button' role='status' aria-label='Adding product' />
              : 'Add Product'}
          </button>
        </div>
    </form>
  )
}

export default AddItems
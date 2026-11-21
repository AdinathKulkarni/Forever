import { useEffect, useState } from 'react'
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router';
import { BACKEND_URL } from '../api'

const ListItems = ({token}) => {

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);


  const fetchList = async() => {
    try{
      setLoading(true);
      const response = await axios.get(`${BACKEND_URL}/api/product/get-all`)

      if(response.data.success){
      setList(response.data.products);
      }
      else{
        toast.error('Error while fetching all data')
        return;
      }

    } catch(e){
      toast.error('Error while fetching all the products')
    } finally{
      setLoading(false);
    }
  };

  const removeProduct = async(id) => {
    try{

      setLoading(true);
      const response = await axios.delete(`${BACKEND_URL}/api/product/remove`,
        //wrap inside single object and then send it. axios ignores third parameter is sent independently
      {
        headers: {token: token},
        data: {id: id}
      });


      if(response.data.success){
        setLoading(false);
        toast.success('Product deleted');
        await fetchList();
      }
      else{
        toast.error(response.data.message);
        return;
      }

    } catch(e){
      console.log(e.message);
      toast.error('Error while deleting the product');
    }
    finally{
      setLoading(false);
    }
  }

  useEffect( () => {
    fetchList();
  },[]);

  const currency = '₹'

  return (
    <div className='mx-auto flex w-full min-w-0 max-w-xl flex-1 flex-col gap-3 p-3 sm:p-5 lg:p-8'>

      {
        loading ? 
        (
          <div className='fixed inset-0 flex items-center justify-center'>
            <div className='spinner'></div>
          </div>
        ) : 
        (
          <div className='mx-auto w-full min-w-0 max-w-6xl'>
            <p className='mb-3 font-medium sm:text-lg text-2xl prata-regular text-center'>All products list</p>

            <div className='mx-auto flex w-full min-w-0 max-w-5xl flex-col items-center justify-center gap-2'>

              <div className='hidden w-full md:grid md:grid-cols-[64px_minmax(0,2fr)_minmax(0,1fr)_96px_64px] items-center gap-2 border bg-gray-100 px-3 py-2 text-center text-xs lg:text-sm'>
                <b>Image</b>
                <b>Name</b>
                <b>Category</b>
                <b>Price</b>
                <b>Action</b>
              </div>

              {
                list.length !== 0 ? 
                (list.map((item, index) => (
                  <div
                    key={item._id || index}
                    className='grid w-full min-w-0 grid-cols-[76px_minmax(0,1fr)_110px] 
                    items-center gap-x-3 gap-y-1 rounded border bg-white p-3 
                    text-sm md:grid-cols-[64px_minmax(0,2fr)_minmax(0,1fr)_96px_64px] 
                    md:gap-2 md:rounded-none md:px-3 md:py-2'
                    >
                    <img
                      src={item.image?.[0]}
                      alt={item.name}
                      className='row-span-3 h-14 w-14 rounded object-cover md:row-span-1 md:h-12 md:w-12'
                    />
                    <p className='col-start-2 min-w-0 break-words font-medium md:col-auto md:truncate md:font-normal'>
                      {item.name}
                    </p>
                    <p className='col-start-2 min-w-0 text-xs text-gray-500 md:col-auto md:text-sm md:text-gray-900'>
                      {item.category}
                    </p>
                    <p className='col-start-2 text-sm font-medium md:col-auto md:font-normal'>
                      {currency} {item.price}
                    </p>
                    <p 
                    className='col-start-3 row-start-1 row-span-3 
                    cursor-pointer text-right text-lg md:col-auto md:row-auto md:text-center'
                    onClick={() => removeProduct(item._id)}
                    >
                      X
                    </p>
                  </div>
                ))) : 
                ( <div className='mx-auto flex min-h-[60vh] w-full flex-col 
                justify-center gap-4 text-center  md:w-[70%]'>
                  <p className='font-medium text-xl'>No Products to display</p>
                  <Link to={'/'} className='text-white bg-black px-4 py-3'>
                      <p>Add a product</p>
                  </Link> 
                </div> )
              }

            </div>
          </div>
        )
      }

    </div>
  )
}

export default ListItems
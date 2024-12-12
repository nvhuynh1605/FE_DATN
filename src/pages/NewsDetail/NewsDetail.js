import { Spin } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LoadingOutlined } from '@ant-design/icons';

function NewsDetail() {
  const [news, setNews] = useState(null);
  const [searchParams] = useSearchParams();

  // Lấy `id` từ query string
  const newsId = searchParams.get('id');

  useEffect(() => {
    const fetchNewsById = async () => {
      if (!newsId) return; // Nếu không có `id`, không fetch
      try {
        const response = await axios.get(`http://localhost:3001/api/news/${newsId}`);
        setNews(response.data);
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };

    fetchNewsById();
  }, [newsId]);

  if (!news) {
    return <div ><Spin indicator={<LoadingOutlined spin />} size="large" /></div>;

  }

  return (
    <div className="max-w-[1240px] mx-auto bg-white p-4 mt-8 min-h-[600px]">
      <div className="p-4">
        <img
          src={news.image}
          alt={news.title}
          className="float-right w-1/3 h-auto ml-4 mb-4 rounded-lg shadow-md"
        />

        <h2 className="text-2xl font-bold mb-2">{news.title}</h2>
        <p className="text-gray-600 mb-4">
          {new Date(news.createdAt).toLocaleDateString()}
        </p>
        <div
          className="text-gray-600"
          dangerouslySetInnerHTML={{ __html: news.content }}
        ></div>
      </div>
    </div>
  );
}

export default NewsDetail;

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

function News() {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const handleViewDetails = (id) => {
    navigate(`/news-detail?id=${id}`);
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/news');
        const filteredNews = response.data.filter(news => news.status !== 0);
        setNewsList(filteredNews);
      } catch (error) {
        console.error('Error fetching news list:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return <div><Spin indicator={<LoadingOutlined spin />} size="large" /></div>;
  }

  return (
    <div className="max-w-[1240px] bg-white mx-auto mt-8 p-4 flex justify-center">
      <div className="flex flex-wrap justify-start w-full gap-4">
        {newsList.map((news, index) => (
          <div
            role='presentation'
            onClick={() => handleViewDetails(news?._id)}
            key={index}
            className="flex flex-col gap-2 min-w-[24%] max-w-[24%] min-h-[420px] p-3 border border-gray-200 rounded-lg cursor-pointer"
          >
            <img
              src={news?.image}
              alt={news.title || 'News Image'}
              className="w-full h-[180px] object-cover"
            />
            <div className="line-clamp-2 h-[60px] p-2 border-b border-gray-200 font-semibold">
              {news.title}
            </div>
            <div className="line-clamp-[4] min-h-[96px]" dangerouslySetInnerHTML={{ __html: news.content }}></div>
            <div className="flex justify-end">
              {new Date(news?.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default News;

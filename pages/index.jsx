import Head from "next/head";
import { Bar } from "react-chartjs-2";
import Loading from "@/components/Loading";
import { LayoutDashboard } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useEffect, useState } from "react";
import LoginLayout from "@/components/LoginLayout";
import Aos from "@/components/Aos";

export default function Home() {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  // use this on top for render error
  const [blogsData, setBlogsData] = useState([]);
  const [postingsData, setPostingsData] = useState([]);
  const [galleriesData, setGalleriesData] = useState([]);
  const [informationsData, setInformationsData] = useState([]);
  const [loading, setLoading] = useState(true);

  // define option within the component scope
  const options = {
    responsive: true,
    maintainAspectRatio: false, // Ini penting untuk kontrol penuh ukuran
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Blog yang Dibuat Setiap Bulan Berdasarkan Tahun",
      },
    },
    scales: {
      x: {
        ticks: {
          autoSkip: true,
          maxRotation: 45,
          minRotation: 45,
        },
      },
    },
  };

  useEffect(() => {
    // fetch data from api
    const fetchData = async () => {
      try {
        const responseBlog = await fetch("/api/blogs");
        const responsePosting = await fetch("/api/postings");
        const responseInformation = await fetch("/api/informations");

        const dataBlog = await responseBlog.json();
        const dataPosting = await responsePosting.json();
        const dataInformation = await responseInformation.json();

        setBlogsData(dataBlog); // asuming data is an array of blog objects
        setPostingsData(dataPosting);
        setInformationsData(dataInformation);
        setLoading(false); // after fetching data make loading false
      } catch (error) {
        setLoading(false);
      }
    };

    fetchData(); // call fetchdaata function
  }, []);

  // Aggregate data by year and month
  const monthlyData = blogsData
    .filter((data) => data.status === "publish")
    .reduce((acc, blog) => {
      const year = new Date(blog.createdAt).getFullYear(); // get the year
      const month = new Date(blog.createdAt).getMonth(); // get the month
      acc[year] = acc[year] || Array(12).fill(0); // initialize array for the year if not exists
      acc[year][month]++;
      return acc;
    }, {});

  const currentYear = new Date().getFullYear();
  const years = Object.keys(monthlyData);
  const labels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Juni",
    "Juli",
    "Aug",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];

  const datasets = years.map((year) => ({
    label: `${year}`,
    data: monthlyData[year] || Array(12).fill(0), // if no data for a month, default to 0
    backgroundColor: `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(
      Math.random() * 256
    )}, ${Math.floor(Math.random() * 256)}, 0.5)`,
  }));

  const data = {
    labels,
    datasets,
  };

  return (
    <LoginLayout>
      <>
        <Head>
          <title>HIMA-RPL ADMIN</title>
          <meta name="description" content="Admin HIMA-RPL" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>

        <div className="dashboard">
          <div className="title__dashboard">
            <div>
              <h2>
                Admin <span>Dashboard</span>
              </h2>
              <h3>ADMIN PANEL</h3>
            </div>
            <div className="marker">
              <LayoutDashboard /> <span>Dashboard</span>
            </div>
          </div>
          {/* Dashboard four cards */}
          <div
            className="dashboard__cards"
            data-aos="fade-right"
            data-aos-duration="1000"
          >
            <div className="card__contents">
              <h2>Total Blog</h2>
              <span>
                {blogsData.filter((data) => data.status === "publish").length}
              </span>
            </div>
            <div className="card__contents">
              <h2>Total Kegiatan</h2>
              <span>
                {
                  postingsData.filter((data) => data.status === "publish")
                    .length
                }
              </span>
            </div>
            <div className="card__contents">
              <h2>Total Informasi</h2>
              <span>
                {
                  informationsData.filter((data) => data.status === "publish")
                    .length
                }
              </span>
            </div>
          </div>
          {/* AOS */}
          <Aos />
          {/* Year overview */}
          <div className="year__overview">
            <div className="left__year__overview">
              <div className="year__overview__content">
                <h3>Ringkasan Tahun</h3>
                <h3 className="text-right">
                  {blogsData.filter((data) => data.status === "publish").length}{" "}
                  / 365 <br />
                  <span>Jumlah yang Diterbitkan</span>
                </h3>
              </div>
              <div
                style={{ position: "relative", height: "80%", width: "100%" }}
              >
                <Bar data={data} options={options} width={null} height={null} />
              </div>
            </div>
            <div
              className="blog__data__content"
              data-aos="flip-left"
              data-aos-duration="1000"
            >
              <div>
                <h3>Blog Kategori</h3>
              </div>
              <div className="blog__data__category__content">
                <table>
                  <thead>
                    <tr>
                      <td>Topik</td>
                      <td>Data</td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Tutorial</td>
                      <td>
                        {
                          blogsData.filter(
                            (data) => data.blogCategory[0] === "tutorial"
                          ).length
                        }
                      </td>
                    </tr>
                    <tr>
                      <td>Pengetahuan Umum</td>
                      <td>
                        {
                          blogsData.filter(
                            (data) =>
                              data.blogCategory[0] === "pengetahuan umum"
                          ).length
                        }
                      </td>
                    </tr>
                    <tr>
                      <td>Karya Pengurus</td>
                      <td>
                        {
                          blogsData.filter(
                            (data) => data.blogCategory[0] === "karya pengurus"
                          ).length
                        }
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </>
    </LoginLayout>
  );
}

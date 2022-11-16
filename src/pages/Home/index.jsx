import Divider from "../../components/Divider";
import Info from "../../components/Info";
import Layout from "../../components/Layout";
import Projects from "../../components/Projects";

import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import Accomplishments from "../../components/Accomplishments";
import Blogs from "../../components/Blog";
import Contact from "../../components/Contact";
import PageLoader from "../../components/PageLoader";
import Skills from "../../components/Skills";
import {
  fetchAccomplishmentsFromDB,
  fetchProjectsFromDB,
  fetchSkillsFromDB,
} from "../../services/firebase";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [skills, setSkills] = useState([]);
  const [accomplishments, setAccomplishments] = useState([]);

  const getBlogs = useCallback(async () => {
    try {
      const url = process.env.REACT_APP_BLOG_URL;
      const { data } = await axios.get(url);
      return data.map((blog) => {
        return {
          content: blog.content.rendered,
          createdAt: blog.date,
          excerpt: blog.excerpt.rendered,
          id: blog.id,
          slug: blog.slug,
          title: blog.title.rendered,
          modified: blog.modified,
          featuredImage: blog.jetpack_featured_media_url,
        };
      });
    } catch (err) {
      console.log(err);
    }
  }, []);

  const getData = useCallback(async () => {
    try {
      const fetchedSkills = await fetchSkillsFromDB();
      const fetchedProjects = await fetchProjectsFromDB();
      const fetchedAccomplishments = await fetchAccomplishmentsFromDB();
      const fetchedBlogs = await getBlogs();
      setSkills(fetchedSkills);
      setProjects(fetchedProjects);
      setBlogs(fetchedBlogs);
      setAccomplishments(fetchedAccomplishments);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    getData();
  }, []);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <Layout>
      <Info />
      <Divider />
      <Skills skills={skills} />
      <Divider />
      <Projects projects={projects} />
      <Divider />
      <Accomplishments accomplishments={accomplishments} />
      <Divider />
      <Blogs blogs={blogs} />
      <Divider />
      <Contact />
    </Layout>
  );
};

export default Home;

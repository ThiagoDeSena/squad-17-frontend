import React from "react";
import { ReviewContainer } from "../../components/FeedPage/Feed/ReviewContainer";



export default {
  title: "Critix/ReviewContainer",
  component: ReviewContainer,
  argTypes: {
    profileImage: { control: "text" },
    profileName: { control: "text" },
    profileId: { control: "text" },
    movieId: { control: "text" },
    plataform: { control: "text" },
  },
};

const Template = (args) => <ReviewContainer {...args} />;

export const Default = Template.bind({});
Default.args = {
  profileImage: "./images/user-img2.png",
  profileName: "Ava Andersson",
  profileId: "12345",
  movieId: "63174",
  plataform: "tv",
};

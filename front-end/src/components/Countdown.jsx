import { useState, useEffect } from 'react';

const Countdown = ({ date }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(date) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const formatTime = (time) => {
    return time < 10 ? `0${time}` : time;
  };

  const { days, hours, minutes, seconds } = timeLeft;

  return (
    <ul>
      <li><h6>days</h6><span>{days}</span></li>
      <li><h6>hours</h6><span>{formatTime(hours)}</span></li>
      <li><h6>minutes</h6><span>{formatTime(minutes)}</span></li>
      <li><h6>seconds</h6><span>{formatTime(seconds)}</span></li>
    </ul>
  );
};

export default Countdown;

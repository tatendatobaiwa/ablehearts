import blob1 from '../../assets/fixed/icons/blob1.webp';
import blob2 from '../../assets/fixed/icons/blob2.webp';
import blob3 from '../../assets/fixed/icons/blob3.webp';
import blob4 from '../../assets/fixed/icons/blob4.webp';

import kediaCover from '../../assets/fixed/kedia/kedia.webp';
import kedia1 from '../../assets/fixed/kedia/K1.webp';
import kedia2 from '../../assets/fixed/kedia/K2.webp';
import kedia3 from '../../assets/fixed/kedia/K3.webp';
import kedia4 from '../../assets/fixed/kedia/K4.webp';
import kedia5 from '../../assets/fixed/kedia/K5.webp';
import kedia6 from '../../assets/fixed/kedia/K6.webp';

import shakaweCover from '../../assets/fixed/shakawe/shakawedono.webp';
import shakawe1 from '../../assets/fixed/shakawe/S1.webp';
import shakawe2 from '../../assets/fixed/shakawe/S2.webp';

import lavenderCover from '../../assets/fixed/lavender/lavender.webp';
import lavender1 from '../../assets/fixed/lavender/L1.webp';
import lavender2 from '../../assets/fixed/lavender/L2.webp';
import lavender3 from '../../assets/fixed/lavender/L3.webp';

import covidCover from '../../assets/fixed/covid/covid.webp';
import covid1 from '../../assets/fixed/covid/C1.webp';
import covid2 from '../../assets/fixed/covid/C2.webp';
import covid3 from '../../assets/fixed/covid/C3.webp';
import covid4 from '../../assets/fixed/covid/C4.webp';

import tsogangCover from '../../assets/fixed/tsogangtrust/tsogangtrust.webp';
import tsogang1 from '../../assets/fixed/tsogangtrust/T1.webp';
import tsogang2 from '../../assets/fixed/tsogangtrust/T2.webp';
import tsogang3 from '../../assets/fixed/tsogangtrust/T3.webp';

import mochudiCover from '../../assets/fixed/mochudi/mochud.webp';
import mochudi1 from '../../assets/fixed/mochudi/M1.webp';
import mochudi2 from '../../assets/fixed/mochudi/M2.webp';
import mochudi3 from '../../assets/fixed/mochudi/M3.webp';
import mochudi4 from '../../assets/fixed/mochudi/M4.webp';
import mochudi5 from '../../assets/fixed/mochudi/M5.webp';
import mochudi6 from '../../assets/fixed/mochudi/M6.webp';

import dynamicTalentCover from '../../assets/fixed/dynamictalent/talentshow.webp';
import dynamicTalent1 from '../../assets/fixed/dynamictalent/DT1.webp';
import dynamicTalent2 from '../../assets/fixed/dynamictalent/DT2.webp';
import dynamicTalent3 from '../../assets/fixed/dynamictalent/DT3.webp';
import dynamicTalent4 from '../../assets/fixed/dynamictalent/DT4.webp';
import dynamicTalent5 from '../../assets/fixed/dynamictalent/DT5.webp';
import dynamicTalent6 from '../../assets/fixed/dynamictalent/DT6.webp';
import dynamicTalent7 from '../../assets/fixed/dynamictalent/DT7.webp';
import dynamicTalent8 from '../../assets/fixed/dynamictalent/DT8.webp';
import dynamicTalent9 from '../../assets/fixed/dynamictalent/DT9.webp';
import dynamicTalent10 from '../../assets/fixed/dynamictalent/DT10.webp';
import dynamicTalent11 from '../../assets/fixed/dynamictalent/DT11.webp';
import dynamicTalent12 from '../../assets/fixed/dynamictalent/DT12.webp';
import dynamicTalent14 from '../../assets/fixed/dynamictalent/DT14.webp';

import lephoiGardenCover from '../../assets/fixed/lephoi/garden.webp';
import lephoiGarden1 from '../../assets/fixed/lephoi/LG1.webp';
import lephoiGarden2 from '../../assets/fixed/lephoi/LG2.webp';
import lephoiGarden3 from '../../assets/fixed/lephoi/LG3.webp';
import lephoiGarden4 from '../../assets/fixed/lephoi/LG4.webp';
import lephoiGarden5 from '../../assets/fixed/lephoi/LG5.webp';
import lephoiGarden6 from '../../assets/fixed/lephoi/LG6.webp';
import lephoiGarden7 from '../../assets/fixed/lephoi/LG7.webp';

import newspaperCover from '../../assets/fixed/newspaper/NP1.webp';
import newspaper2 from '../../assets/fixed/newspaper/NP2.webp';
import newspaper3 from '../../assets/fixed/newspaper/NP3.webp';
import newspaper4 from '../../assets/fixed/newspaper/NP4.webp';
import newspaper5 from '../../assets/fixed/newspaper/NP5.webp';

import firstEventCover from '../../assets/fixed/firstevent/FE1.webp';
import firstEvent2 from '../../assets/fixed/firstevent/FE2.webp';
import firstEvent3 from '../../assets/fixed/firstevent/FE3.webp';
import firstEvent4 from '../../assets/fixed/firstevent/FE4.webp';

import cheshirefoundationCover from '../../assets/fixed/chesirefoundation/chescover.webp';
import cheshirefoundation1 from '../../assets/fixed/chesirefoundation/ches1.webp';
import cheshirefoundation2 from '../../assets/fixed/chesirefoundation/ches2.webp';
import cheshirefoundation3 from '../../assets/fixed/chesirefoundation/ches3.webp';

import tlokwengCover from '../../assets/fixed/tlokwengfamily/tlok2.webp';
import tlokweng1 from '../../assets/fixed/tlokwengfamily/tlok1.webp';
import tlokweng2 from '../../assets/fixed/tlokwengfamily/tlok3.webp';

export const blobImagePaths = [blob1, blob3, blob4, blob2];

const createImageData = (id, importedUrl, caption, width = 800, height = 600) => ({
  id,
  url: importedUrl,
  caption,
  width,
  height,
});

const data = [
  {
    id: 'kedia',
    title: 'Kedia Primary Donation',
    coverImage: kediaCover,
    description: 'A heartfelt initiative to provide essential resources and support to Kedia Primary School.',
    date: 'July 6, 2024',
    images: [
      createImageData('k1', kediaCover, 'Setting the stage: Organizing shoes and supplies for distribution.'),
      createImageData('k2', kedia1, 'A display of hope: New shoes lined up for eager young feet.'),
      createImageData('k3', kedia2, 'Smiles of gratitude: A moment shared with the students and volunteers.'),
      createImageData('k4', kedia3, 'Joy in unity: Students celebrating the generous donations.'),
      createImageData('k5', kedia4, 'Grateful hearts: Capturing the spirit of the event with a selfie.'),
      createImageData('k6', kedia5, 'Sharing knowledge: A group of volunteers engaging with the community.'),
      createImageData('k7', kedia6, 'Bundles of care: Essential supplies ready for distribution to those in need.'),
    ],
  },
  {
    id: 'shakawe',
    title: 'Shakawe JSS Donation',
    coverImage: shakaweCover,
    description: 'A generous contribution aimed at enhancing the learning environment for students at Shakawe Junior Secondary School.',
    date: 'April 29, 2021',
    images: [
      createImageData('s1', shakaweCover, 'Collaborative efforts: Volunteers working together to organize donations for Shakawe JSS.'),
      createImageData('s2', shakawe1, 'Prepared with care: A set of new uniforms ready to bring smiles to students in need.'),
      createImageData('s3', shakawe2, 'Making a difference: Reception of donation boxes from Able Hearts.'),
    ],
  },
  {
    id: 'lavenderTea',
    title: 'Lavender High Tea',
    coverImage: lavenderCover,
    description: 'A delightful gathering to raise funds and awareness for community development projects.',
    date: 'August 9, 2020',
    images: [
      createImageData('lt1', lavenderCover, 'Elegance and purpose: Guests enjoy the Lavender High Tea in their stunning attire.'),
      createImageData('lt2', lavender1, 'Moments of connection: Sharing laughter and inspiration at the Lavender High Tea.'),
      createImageData('lt3', lavender2, 'Words of empowerment: A speaker addressing attendees about community impact.'),
      createImageData('lt4', lavender3, 'A picture-perfect day: The vibrant Lavender High Tea setup, blending charm and philanthropy.'),
    ],
  },
  {
    id: 'covidRelief',
    title: 'Covid-19 Community Relief Packages',
    coverImage: covidCover,
    description: 'A dedicated effort to distribute essential supplies to communities affected by the pandemic.',
    date: '2020',
    images: [
      createImageData('cr1', covidCover, 'A heartwarming moment: Able Hearts Foundation spreading hope with COVID relief packages to the elderly.'),
      createImageData('cr2', covid1, 'A closer look: The thoughtful contents of an Able Hearts COVID relief package.'),
      createImageData('cr3', covid2, 'Essentials for the elderly during COVID.'),
      createImageData('cr4', covid3, 'Able Hearts team with Hon. Ignatius Moswaane supporting the community.'),
      createImageData('cr5', covid4, 'Spreading hope with COVID relief packages.'),
    ],
  },
  {
    id: 'tsogangTrust',
    title: 'Tsogang Trust',
    coverImage: tsogangCover,
    description: 'Collaboration with Tsogang Trust to empower local communities through education and skill development.',
    date: 'October 27, 2022',
    images: [
      createImageData('tt1', tsogangCover, 'Senn Foods providing essential supplies to Tsogang Trust.'),
      createImageData('tt2', tsogang1, 'Ms. Sakshi Bhargava, our visionary founder.'),
      createImageData('tt3', tsogang2, 'Ms. Sakshi Bhargava with a young mind at Tsogang Trust.'),
      createImageData('tt4', tsogang3, 'Senn Foods donation fueling hope and community support.'),
    ],
  },
  {
    id: 'mochudiCenter',
    title: 'Mochudi Resource Center',
    coverImage: mochudiCover,
    description: 'An initiative to equip the Mochudi Resource Center with vital resources to foster community engagement.',
    date: 'April 22, 2021',
    images: [
      createImageData('mc1', mochudiCover, 'Able Hearts team delivering supplies to Mochudi Resource Center.'),
      createImageData('mc2', mochudi1, 'Ms. Sakshi Bhargava sharing a special moment with children.'),
      createImageData('mc3', mochudi2, 'Able Hearts team sorting packages at Mochudi Resource Center.'),
      createImageData('mc4', mochudi3, 'Strengthening community support at Mochudi.'),
      createImageData('mc5', mochudi4, 'Thoughtful contents of an Able Hearts package for children.'),
      createImageData('mc6', mochudi5, 'Engaging with children through fun and learning.'),
      createImageData('mc7', mochudi6, 'Able Hearts team presenting packages, bringing hope.'),
    ],
  },
  {
    id: 'dynamicTalent',
    title: 'Dynamic Talent Show',
    coverImage: dynamicTalentCover,
    description: 'A showcase of vibrant talents aimed at celebrating creativity and diversity.',
    date: 'August 20, 2023',
    images: [
      createImageData('dt1', dynamicTalentCover, 'Sakshi Bhargava, representing Ablehearts, confidently addresses the audience and young participants on stage, setting an inspiring tone for the Dynamic Talent Show.'),
      createImageData('dt2', dynamicTalent1, 'Donations and supplies are neatly organized, showcasing the generous support for the Ablehearts organisation\'s community initiatives.'),
      createImageData('dt3', dynamicTalent2, 'Ablehearts founder, Sakshi Bhargav presenting donations and supplies enthusiastically.'),
      createImageData('dt4', dynamicTalent3, 'The dedicated team from Ablehearts and event volunteers pose together, celebrating a successful day of community engagement.'),
      createImageData('dt5', dynamicTalent4, 'Participants and organizers of the Dynamic Talent Show gather for a group photo, capturing a moment of shared joy and accomplishment.'),
      createImageData('dt6', dynamicTalent5, 'A heartwarming moment as members of the Ablehearts team connect with children from the community, embodying the spirit of the event.'),
      createImageData('dt7', dynamicTalent6, 'Sakshi Bhargava from the Ablehearts organisation delivers a presentation, sharing the NGO\'s mission and impact with the audience.'),
      createImageData('dt8', dynamicTalent7, 'An attentive audience listens to a presentation during the Dynamic Talent Show, learning more about the work of the Ablehearts organisation.'),
      createImageData('dt9', dynamicTalent8, ''),
      createImageData('dt10', dynamicTalent9, 'Smiles and laughter are shared between a volunteer and a community member, highlighting the positive connections forged at the event.'),
      createImageData('dt11', dynamicTalent10, 'Creating lasting memories, one performance at a time.'),
      createImageData('dt12', dynamicTalent11, 'A vibrant and engaged audience of children eagerly watches the performances at the Dynamic Talent Show.'),
      createImageData('dt13', dynamicTalent12, 'Bringing the community together through the power of art.'),
      createImageData('dt14', dynamicTalent14, 'A joyful and affectionate moment is captured between Sakshi Bhargava and a young child, reflecting the caring and supportive atmosphere of the day.'),
    ],
  },
  {
    id: 'lephoiGarden',
    title: 'Lephoi Able Hearts Garden and Fun Day',
    coverImage: lephoiGardenCover,
    description: 'A fun-filled day celebrating community spirit and sustainable gardening initiatives.',
    date: 'August 15, 2020',
    images: [
      createImageData('lg1', lephoiGardenCover, 'Able Hearts Garden Grand Opening!'),
      createImageData('lg2', lephoiGarden1, 'Our founder, Ms. Sakshi Bhargava, leading with compassion.'),
      createImageData('lg3', lephoiGarden2, 'Kids unleashing creativity with beads during the fun day!'),
      createImageData('lg4', lephoiGarden3, 'More creative moments with bead making.'),
      createImageData('lg5', lephoiGarden4, 'Ms. Sakshi Bhargava guiding kids in beadwork.'),
      createImageData('lg6', lephoiGarden5, 'Able Hearts delivering essential donations at Lephoi Centre.'),
      createImageData('lg7', lephoiGarden6, 'The Able Hearts crew, united in service.'),
      createImageData('lg8', lephoiGarden7, 'UCCSA Lephoi Centre for Learners with Visual Impairment.'),
    ],
  },
  {
    id: 'newsArticles',
    title: 'News Articles',
    coverImage: newspaperCover,
    description: 'A collection of impactful news articles highlighting community achievements and milestones.',
    date: '',
    images: [
      createImageData('na1', newspaperCover, 'Media supporters featuring the Able Hearts garden handover.'),
      createImageData('na2', newspaper2, 'Kgosi Moagi performing during the garden handover ceremony.'),
      createImageData('na3', newspaper3, 'Thank you to The Voice Newspaper Botswana and The Monitor.'),
      createImageData('na4', newspaper4, 'Showcasing our journey of giving back.'),
      createImageData('na5', newspaper5, 'Thank you Yarona FM for giving us a platform.'),
    ],
  },
  {
    id: 'firstEvent',
    title: 'First Ever Event',
    coverImage: firstEventCover,
    description: 'The landmark event that marked the beginning of our journey in making a difference.',
    date: 'August 25, 2017',
    images: [
      createImageData('fe1', firstEventCover, 'Students gather to celebrate the first Able Hearts event.'),
      createImageData('fe2', firstEvent2, 'Spreading smiles through fun and learning.'),
      createImageData('fe3', firstEvent3, 'Distributing clothes, books, and toys for brighter tomorrows.'),
      createImageData('fe4', firstEvent4, 'Donations of school shoes bring joy and opportunity.'),
    ],
  },
  {
    id: 'cheshireFoundation',
    title: 'Cheshire Foundation',
    coverImage: cheshirefoundationCover,
    description: 'A collaboration with Cheshire Foundation to provide essential resources by the BIUST branch.',
    date: 'May 15, 2025',
    images: [
      createImageData('cf1', cheshirefoundationCover, 'Members of Ablehearts BIUST and Cheshire Foundation staff.'),
      createImageData('cf2', cheshirefoundation1, 'Ablehearts BIUST delivering donations to Cheshire Foundation.'),
      createImageData('cf3', cheshirefoundation2, 'Cheshire Foundation of Botswana, Palapye Regional Office.'),
      createImageData('cf4', cheshirefoundation3, 'Ablehearts BIUST members with a Cheshire Foundation vehicle.'),
    ],
  },
  {
    id: 'tlokwengFamily',
    title: 'Tlokweng Family Visit',
    coverImage: tlokwengCover,
    description: 'AbleHearts UB branch travelled to Tlokweng, Botswana to provide essential resources to a chosen family.',
    date: 'May 8, 2025',
    images: [
      createImageData('tf1', tlokwengCover, 'Ablehearts UB delivering donations in Tlokweng.'),
      createImageData('tf2', tlokweng1, 'Ablehearts UB members spreading love in Tlokweng.'),
      createImageData('tf3', tlokweng2, 'Ablehearts UB branch during community outreach in Tlokweng.'),
    ],
  },
].sort((a, b) => {
  if (!a.date && !b.date) return 0;
  if (!a.date) return 1;
  if (!b.date) return -1;
  try {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    if (isNaN(dateA.valueOf()) && isNaN(dateB.valueOf())) return 0;
    if (isNaN(dateA.valueOf())) return 1;
    if (isNaN(dateB.valueOf())) return -1;
    return dateB - dateA;
  } catch (error) { return 0; }
});

export const galleryEventsData = data;
export default galleryEventsData;

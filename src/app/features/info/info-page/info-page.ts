import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlobBackgroundComponent } from '../../../shared/components/blob-background/blob-background';

@Component({
  selector: 'app-info-page',
  standalone: true,
  imports: [CommonModule, BlobBackgroundComponent],
  templateUrl: './info-page.html',
  styleUrl: './info-page.css',
})
export class InfoPageComponent {
   
  groupPhoto = 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80';

  scrollToElement(elementId: string): void {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
    }
  }

  techStack = [
    { name: 'MongoDB', icon: 'database', color: 'text-green-600' },
    { name: 'Express', icon: 'deployed_code', color: 'text-gray-700' },
    { name: 'Angular', icon: 'change_history', color: 'text-red-600' },
    { name: 'Node.js', icon: 'nodejs', color: 'text-green-500' },
    { name: 'TypeScript', icon: 'terminal', color: 'text-blue-600' },
  ];

   team = [
    { 
      name: 'Ziyad Saeed', 
      role: 'UI/UX Architect', 
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80',
      github: '#', 
      linkedin: '#' 
    },
    { 
      name: 'Mostafa Magdy', 
      role: 'Backend Lead', 
      image: 'https://scontent.fcai19-2.fna.fbcdn.net/v/t39.30808-6/475482574_9515800908470358_1258999011266720386_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=1d70fc&_nc_ohc=r4XzeoOiGkwQ7kNvwFWfvut&_nc_oc=Adp1tYkZZqTRA0pZcCdXaz79PljCbTVqnbj7hok3FWoXyJiHQ3znLI7I4YQKevz10Ic&_nc_zt=23&_nc_ht=scontent.fcai19-2.fna&_nc_gid=g1d7X0V6KmxoerIxc3ZvoA&_nc_ss=7a3a8&oh=00_Af1mnMqW-LO2090gENDpJjGlr_vgvGFQRpfb_j3JrHKn_Q&oe=69DD0B02',
      github: '#', 
      linkedin: '#' 
    },
    { 
      name: 'Islam Gabara', 
      role: 'Cloud Specialist', 
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80',
      github: '#', 
      linkedin: '#' 
    },
    { 
      name: 'Marwan Abdelhakim', 
      role: 'Frontend Expert', 
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80',
      github: '#', 
      linkedin: '#' 
    },
    { 
      name: 'Saleh Mahmoud', 
      role: 'Logic Strategist', 
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80',
      github: '#', 
      linkedin: '#' 
    },
  ];
}


import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-b from-blue-50 to-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* About */}
          <div>
            <h3 className="text-2xl font-bold mb-4 text-primary">
              Colecta<span className="text-secondary">Segura</span>
            </h3>
            <p className="text-foreground/70 mb-4 text-sm">
              Plataforma de microdonaciones que conecta personas con causas que importan,
              facilitando la transparencia y el seguimiento de cada proyecto.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-foreground/60 hover:text-primary transition-colors duration-300">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-foreground/60 hover:text-primary transition-colors duration-300">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-foreground/60 hover:text-primary transition-colors duration-300">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-foreground/60 hover:text-primary transition-colors duration-300">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-foreground/70 hover:text-primary transition-colors duration-300 text-sm">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/projects" className="text-foreground/70 hover:text-primary transition-colors duration-300 text-sm">
                  Proyectos
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-foreground/70 hover:text-primary transition-colors duration-300 text-sm">
                  Cómo Funciona
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-foreground/70 hover:text-primary transition-colors duration-300 text-sm">
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-foreground/70 hover:text-primary transition-colors duration-300 text-sm">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="text-foreground/70 hover:text-primary transition-colors duration-300 text-sm">
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link to="#" className="text-foreground/70 hover:text-primary transition-colors duration-300 text-sm">
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link to="#" className="text-foreground/70 hover:text-primary transition-colors duration-300 text-sm">
                  Aviso Legal
                </Link>
              </li>
              <li>
                <Link to="#" className="text-foreground/70 hover:text-primary transition-colors duration-300 text-sm">
                  Cookies
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Contacto</h4>
            <ul className="space-y-3">
              <li className="flex">
                <MapPin className="h-5 w-5 mr-3 text-primary flex-shrink-0" />
                <span className="text-foreground/70 text-sm">
                  Av. Revolución 123, Col. Centro, Ciudad de México, México
                </span>
              </li>
              <li className="flex">
                <Mail className="h-5 w-5 mr-3 text-primary flex-shrink-0" />
                <a href="mailto:info@colectasegura.com" className="text-foreground/70 hover:text-primary transition-colors duration-300 text-sm">
                  info@colectasegura.com
                </a>
              </li>
              <li className="flex">
                <Phone className="h-5 w-5 mr-3 text-primary flex-shrink-0" />
                <a href="tel:+5255123456789" className="text-foreground/70 hover:text-primary transition-colors duration-300 text-sm">
                  +52 55 1234 5678
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 text-center">
          <p className="text-foreground/60 text-sm">
            &copy; {new Date().getFullYear()} ColectaSegura. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

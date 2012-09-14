%define name    TryCatchAPI
#This is the release number. Incremented everytime bamboo makes a build
%define release    %RELEASE_NUMBER
# This is the version number. Set by the build shell script.
%define version %BUILD_NUMBER

%define buildroot %{_tmppath}/%{name}-%{version}-%{release}

%define _unpackaged_files_terminate_build 0
%define _missing_doc_files_terminate_build 0

Summary:      TryCatchAPI
Name:         %{name}
Version:      %{version}
Release:      %{release}
Group:        Applications/Internal
License:      GPL
URL:          https://redhatsat01.news.newslimited.local
BuildArch:    noarch
BuildRoot:    %{buildroot}
Prefix:       /usr/local
Source:       %{name}-%{version}-%{release}.tar.gz

Distribution: RHEL5.x CentOS5.x
Vendor:       NDM
Packager:     David Mann <david.mann@newsdigitalmedia.com.au>


%description
The TryCatchAPI allows a user to ingest environments information and then have this information retrieved through an simple rest interface

%prep
# Tar up the htdocs dir based on version
# tar contains the htdocs dir we want this to be placed in a directory based on version number and package name and then sym link to this
%setup -c -n %{name}-%{version}
#%setup -q

#we can run the build DB extraction at this point + css and js minification if it has to be done after phing time
#http://www.davedevelopment.co.uk/2008/04/14/how-to-simple-database-migrations-with-phing-and-dbdeploy/
#%build

%install
mkdir -p $RPM_BUILD_ROOT/projects/informative-dashboard/releases/%{version}
cp -R src $RPM_BUILD_ROOT/projects/informative-dashboard/releases/%{version}/.
cp -R vendor $RPM_BUILD_ROOT/projects/informative-dashboard/releases/%{version}/.
cp -R web $RPM_BUILD_ROOT/projects/informative-dashboard/releases/%{version}/.
cp -R app $RPM_BUILD_ROOT/projects/informative-dashboard/releases/%{version}/.
rm -rf $RPM_BUILD_ROOT/projects/informative-dashboard/releases/%{version}/app/cache/*
rm -rf $RPM_BUILD_ROOT/projects/informative-dashboard/releases/%{version}/app/logs/*
cp -R app $RPM_BUILD_ROOT/projects/informative-dashboard/releases/%{version}/.

%files
%defattr (755,java,java)
#in UAT and PROD we only need the following and hence the _unpackaged_files_terminate_build and _missing_doc_files_terminate_build declaration
 /projects/informative-dashboard/releases/%{version}/web
 /projects/informative-dashboard/releases/%{version}/app
 /projects/informative-dashboard/releases/%{version}/vendor
 /projects/informative-dashboard/releases/%{version}/src

%clean
rm -rf $RPM_BUILD_ROOT

%pre
# Don't need to do anything pre-install

%post
# php /projects/informative-dashboard/releases/scripts/init-config.php -v%{version}-%{release}
rm -f /projects/informative-dashboard/current; true;
ln -s /projects/informative-dashboard/releases/%{version} /projects/informative-dashboard/current;
cp -Rf /projects/informative-dashboard/shared /projects/informative-dashboard/current/; true;
/projects/informative-dashboard/current/app/console doctrine:schema:update
service httpd graceful


%changelog

* Thu Sep 13 2012 David Mann <david.mann@newsdigitalmedia.com.au>
- Initial

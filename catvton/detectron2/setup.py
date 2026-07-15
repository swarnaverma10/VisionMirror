from setuptools import setup, find_packages

setup(
    name="detectron2",
    version="0.6",
    packages=find_packages(where="..", include=["detectron2", "detectron2.*"]),
    package_dir={"": ".."},
)

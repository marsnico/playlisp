;
; Filename: base.scm
; Desc: this is a demo script including all syntax examples
; Date: March 18th 2020
; Author: Nicolas Xiao
;

(do
  (let x 100)
  (print x)
  (print "hello, world!")
  (let name "devilandpuppy")
  (print "hello," name)
  (let a-list (quote (1 2 3)))
  (print (el a-list 0) a-list 100)
  (print (el a-list 0) (el a-list 1) (el a-list 2))
  (print (el (quote (100 200 300)) 0))
  (print (+ 1 2 3 4 5 6 7 8 9 10))
  (print (- 10 2))
  (print (* 1 2 3 4 5 6 7 8 9 10))
  (print (/ 10 3))
  (let another-list '(6 7 8))
  (print (el another-list 0))
  (let symbol 'this-is-a-symbol)
  (print symbol)
  (let a-list-composed-by-list [1 2 3])
  (print (el a-list-composed-by-list 0))
  (print a-list-composed-by-list)
  (let eval-list [1 (+ 1 2) (+ 2 3)])
  (print eval-list)
  (let zz [1 2])
  (print (el zz 0) (el zz 1))
  (print '(1 2 3))
  ;(print "this is a list" '(1 2 (3)))
  (let add
    (fn (x y)
      (+ x y)
    )
  )
  (let say-hello
    (fn (msg)
      (print "hello, " msg)
      (print "waiting...")
      (print "waiting...")
      (print "end.")
    )
  )
  (print (add 10 20))
  (say-hello "nicolas")
  ;(print "hello")
  (print "world")
)